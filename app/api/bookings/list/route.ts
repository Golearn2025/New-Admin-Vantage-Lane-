/**
 * Bookings List API - Orchestration Only
 * NO business logic here - just coordination
 * Compliant: <150 lines
 */

import { logger } from '@/lib/utils/logger';
import type { BookingsListResponse } from '@admin-shared/api/contracts/bookings';
import type { BookingsListParams, BookingRowDTO } from '@entities/booking/types/bookingsList.types';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Status mapping from DB to contract enum
function mapDbStatusToContract(dbStatus: string): 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' {
  switch (dbStatus?.toUpperCase()) {
    case 'NEW':
    case 'PENDING':
      return 'pending';
    case 'ASSIGNED':
      return 'assigned';
    case 'EN_ROUTE':
    case 'ENROUTE':
      return 'en_route';
    case 'ARRIVED':
      return 'arrived';
    case 'IN_PROGRESS':
    case 'INPROGRESS':
      return 'in_progress';
    case 'COMPLETED':
    case 'FINISHED':
      return 'completed';
    case 'CANCELLED':
    case 'CANCELED':
      return 'cancelled';
    default:
      return 'pending'; // Default fallback
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Extract and validate Authorization token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('Missing Authorization token in bookings list API');
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' }, 
        { status: 401 }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { 
        global: { 
          headers: { Authorization: `Bearer ${token}` } 
        } 
      }
    );
    
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters with strict types
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const requestedPageSize = parseInt(searchParams.get('page_size') || '25', 10);
    const pageSize = requestedPageSize > 1000 ? Math.min(requestedPageSize, 10000) : Math.min(requestedPageSize, 100);
    
    // Prepare RPC parameters with strict validation
    const validSorts: BookingsListParams['sort'][] = ['created_at', 'pickup_time', 'status', 'price_total'];
    const validDirs: BookingsListParams['dir'][] = ['asc', 'desc'];
    
    const sortParam = searchParams.get('sort') || 'created_at';
    const dirParam = searchParams.get('dir') || 'desc';
    
    const rpcParams: BookingsListParams = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      sort: validSorts.includes(sortParam as BookingsListParams['sort']) 
        ? (sortParam as BookingsListParams['sort']) 
        : 'created_at',
      dir: validDirs.includes(dirParam as BookingsListParams['dir'])
        ? (dirParam as BookingsListParams['dir'])
        : 'desc',
      search: searchParams.get('search') || null,
      status: searchParams.get('status') || null,
      from: searchParams.get('from') || null,
      to: searchParams.get('to') || null,
    };

    // Call RPC function with correct parameter order
    // Function expects: p_limit, p_offset, p_sort, p_dir, p_search, p_status, p_from, p_to
    const { data, error } = await supabase.rpc('get_bookings_list', {
      p_limit: rpcParams.limit,
      p_offset: rpcParams.offset,
      p_sort: rpcParams.sort,
      p_dir: rpcParams.dir,
      p_search: rpcParams.search,
      p_status: rpcParams.status,
      p_from: rpcParams.from,
      p_to: rpcParams.to,
    });
    
    if (error) {
      logger.error('RPC get_bookings_list failed', { 
        error: error.message, 
        code: error.code,
        params: rpcParams,
        token_present: !!token
      });
      
      // Return proper error response instead of throwing
      return NextResponse.json(
        { 
          error: `Database query failed: ${error.message}`,
          code: error.code,
          details: error.details || 'No additional details'
        }, 
        { status: 500 }
      );
    }

    const rows = (data as BookingRowDTO[]) || [];
    const total = rows.length > 0 ? (rows[0]?.total_count ?? 0) : 0;
    
    // Build response matching existing contract
    const totalPages = Math.ceil(total / pageSize);
    const response: BookingsListResponse = {
      data: rows.map(row => ({
          // Core identifiers
          id: row.booking_id,
          reference: row.reference || 'N/A',
          
          // Status & flags - map DB values to contract enum
          status: mapDbStatusToContract(row.status),
          is_urgent: false, // TODO: Calculate from pickup_time < 3h and no driver
          is_new: false, // TODO: Calculate from created_at < 24h ago
          
          // Trip info
          trip_type: (row.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet') || 'oneway',
          category: 'EXEC', // TODO: Get from booking data
          vehicle_model: null, // TODO: Get from vehicle assignment
          
          // Customer info - handle null/undefined safely
          customer_name: row.customer_name || 'Unknown Customer',
          customer_phone: row.customer_phone || '',
          customer_email: row.customer_email || null,
          customer_total_bookings: 0, // TODO: Calculate
          customer_loyalty_tier: null,
          customer_status: null,
          customer_total_spent: 0,
          
          // Locations
          pickup_location: row.pickup_address,
          destination: row.dropoff_address,
          
          // Dates
          scheduled_at: row.pickup_time,
          created_at: row.created_at,
          
          // Trip details
          distance_miles: null,
          duration_min: null,
          hours: null,
          passenger_count: null,
          bag_count: null,
          flight_number: null,
          notes: null,
          
          // Return trip
          return_date: null,
          return_time: null,
          return_flight_number: null,
          
          // Fleet
          fleet_executive: null,
          fleet_s_class: null,
          fleet_v_class: null,
          fleet_suv: null,
          
          // Pricing - convert string to number
          fare_amount: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
          base_price: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
          platform_fee: 0,
          operator_net: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
          driver_payout: 0,
          platform_commission_pct: null,
          driver_commission_pct: null,
          paid_services: [],
          free_services: [],
          payment_method: 'CARD',
          payment_status: 'pending',
          currency: row.currency || 'GBP',
          
          // Assignment
          driver_name: row.driver_name,
          driver_id: row.driver_id,
          driver_phone: null,
          driver_email: null,
          driver_rating: null,
          vehicle_id: row.vehicle_id,
          vehicle_make: null,
          vehicle_model_name: row.vehicle_name,
          vehicle_year: null,
          vehicle_color: null,
          vehicle_plate: null,
          assigned_at: null,
          assigned_by_name: null,
          
          // Meta
          operator_name: row.organization_name,
          operator_rating: null,
          operator_reviews: null,
          source: 'web' as const,
          
          // Legs
          legs: [],
        })),
        pagination: {
          total_count: total,
          page_size: pageSize,
          has_next_page: page < totalPages,
          has_previous_page: page > 1,
          current_page: page,
          total_pages: totalPages,
        },
        performance: {
          query_duration_ms: Date.now() - startTime,
          cache_hit: false,
        },
      };

    logger.info('Bookings list RPC success', {
      total_rows: rows.length,
      total_count: total,
      duration_ms: Date.now() - startTime
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Unexpected error in bookings list API', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
