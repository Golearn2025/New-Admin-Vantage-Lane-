/**
 * Bookings List API Route
 * 
 * GET /api/bookings/list
 * Returns paginated list of bookings with filters
 * Uses Supabase RLS for security
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { BookingsListResponse, BookingListItem } from '@admin/shared/api/contracts/bookings';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('page_size') || '25', 10), 100);
    const statusParam = searchParams.get('status');
    const status = statusParam as 'pending' | 'active' | 'completed' | 'cancelled' | null;
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Base query - get bookings with customer info
    let query = supabase
      .from('bookings')
      .select(`
        id,
        reference,
        status,
        booking_status,
        trip_type,
        category,
        start_at,
        created_at,
        customer_id,
        assigned_driver_id,
        customers (
          first_name,
          last_name
        )
      `, { count: 'exact' });
    
    // Apply status filter if provided
    if (status) {
      // Map our API status to database status
      const dbStatus = status === 'pending' ? 'NEW' : 
                       status === 'active' ? 'ASSIGNED' :
                       status === 'completed' ? 'COMPLETED' :
                       'CANCELLED';
      query = query.eq('status', dbStatus);
    }
    
    // Sorting - always by created_at DESC for consistency
    query = query.order('created_at', { ascending: false });
    
    // Pagination - offset based (simpler for MVP)
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);
    
    // Execute query
    const { data: bookings, error, count } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: error.message },
        { status: 500 }
      );
    }
    
    // Get booking segments (pickup/destination) for all bookings
    const bookingIds = bookings?.map((b) => b.id) || [];
    const { data: segments } = await supabase
      .from('booking_segments')
      .select('booking_id, seq_no, role, place_text, place_label')
      .in('booking_id', bookingIds)
      .order('seq_no', { ascending: true });
    
    // Get pricing for all bookings
    const { data: pricing } = await supabase
      .from('booking_pricing')
      .select('booking_id, price')
      .in('booking_id', bookingIds);
    
    // Get driver info if assigned
    const driverIds = bookings?.map((b) => b.assigned_driver_id).filter(Boolean) || [];
    const { data: drivers } = driverIds.length > 0 
      ? await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .in('id', driverIds)
      : { data: [] };
    
    // Transform to API response format
    const items: BookingListItem[] = (bookings || []).map((booking) => {
      // Get segments for this booking
      const bookingSegments = segments?.filter((s) => s.booking_id === booking.id) || [];
      const pickup = bookingSegments.find((s) => s.role === 'pickup');
      const dropoff = bookingSegments.find((s) => s.role === 'dropoff');
      
      // Get pricing
      const bookingPricing = pricing?.find((p) => p.booking_id === booking.id);
      
      // Get driver
      const driver = drivers?.find((d) => d.id === booking.assigned_driver_id);
      
      // Map database status to API status
      const apiStatus = booking.status === 'NEW' ? 'pending' as const :
                       booking.status === 'ASSIGNED' ? 'active' as const :
                       booking.status === 'COMPLETED' ? 'completed' as const :
                       'cancelled' as const;
      
      // Supabase returns customers as array from select - take first
      const customerArray = booking.customers as unknown as Array<{ first_name: string; last_name: string }> | null;
      const customer = customerArray && customerArray.length > 0 ? customerArray[0] : null;
      
      return {
        id: booking.id,
        status: apiStatus,
        customer_name: customer
          ? `${customer.first_name} ${customer.last_name}`
          : 'Unknown',
        pickup_location: pickup?.place_label || pickup?.place_text || 'N/A',
        destination: dropoff?.place_label || dropoff?.place_text || 'N/A',
        scheduled_at: booking.start_at,
        created_at: booking.created_at,
        fare_amount: bookingPricing?.price || 0,
        driver_name: driver ? `${driver.first_name} ${driver.last_name}` : null,
        operator_name: 'Vantage Lane', // Default for MVP
        source: 'web' as const, // Default for MVP
      };
    });
    
    // Calculate pagination metadata
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    // Build response
    const response: BookingsListResponse = {
      data: items,
      pagination: {
        total_count: totalCount,
        page_size: pageSize,
        has_next_page: hasNextPage,
        has_previous_page: hasPreviousPage,
        current_page: page,
        total_pages: totalPages,
      },
      performance: {
        query_duration_ms: Date.now() - startTime,
        cache_hit: false,
      },
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
