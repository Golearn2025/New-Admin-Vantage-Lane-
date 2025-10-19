/**
 * Bookings List API - Query Builder
 * Builds and executes Supabase queries
 * Compliant: <150 lines
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryParams, QueryResult, RawBooking } from './types';

/**
 * Build and execute all queries needed for bookings list
 */
export async function fetchBookingsData(
  supabase: SupabaseClient,
  params: QueryParams
): Promise<QueryResult> {
  const { page, pageSize, status } = params;
  
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
      vehicle_model,
      start_at,
      created_at,
      customer_id,
      assigned_driver_id,
      assigned_vehicle_id,
      distance_miles,
      duration_min,
      hours,
      return_date,
      return_time,
      return_flight_number,
      fleet_executive,
      fleet_s_class,
      fleet_v_class,
      fleet_suv,
      customers (
        first_name,
        last_name,
        phone,
        total_rides
      )
    `, { count: 'exact' });
  
  // Apply status filter if provided
  if (status) {
    const dbStatus = mapStatusToDb(status);
    query = query.eq('status', dbStatus);
  }
  
  // Sorting - always by created_at DESC for consistency
  query = query.order('created_at', { ascending: false });
  
  // Pagination - offset based
  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);
  
  // Execute main query
  const { data: bookings, error, count } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
  
  if (!bookings || bookings.length === 0) {
    return {
      bookings: [],
      totalCount: count || 0,
      segments: [],
      pricing: [],
      drivers: [],
    };
  }
  
  // Get related data in parallel
  const bookingIds = bookings.map((b) => b.id);
  
  const [segmentsResult, pricingResult, driversResult] = await Promise.all([
    fetchSegments(supabase, bookingIds),
    fetchPricing(supabase, bookingIds),
    fetchDrivers(supabase, bookings as RawBooking[]),
  ]);
  
  return {
    bookings: bookings as RawBooking[],
    totalCount: count || 0,
    segments: segmentsResult,
    pricing: pricingResult,
    drivers: driversResult,
  };
}

/**
 * Fetch booking segments (pickup/dropoff locations)
 */
async function fetchSegments(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_segments')
    .select('booking_id, seq_no, role, place_text, place_label')
    .in('booking_id', bookingIds)
    .order('seq_no', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch segments: ${error.message}`);
  }
  
  return data || [];
}

/**
 * Fetch booking pricing
 */
async function fetchPricing(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_pricing')
    .select('booking_id, price')
    .in('booking_id', bookingIds);
  
  if (error) {
    throw new Error(`Failed to fetch pricing: ${error.message}`);
  }
  
  return data || [];
}

/**
 * Fetch driver info for assigned bookings
 */
async function fetchDrivers(supabase: SupabaseClient, bookings: RawBooking[]) {
  const driverIds = bookings
    .map((b) => b.assigned_driver_id)
    .filter(Boolean) as string[];
  
  if (driverIds.length === 0) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('drivers')
    .select('id, first_name, last_name')
    .in('id', driverIds);
  
  if (error) {
    throw new Error(`Failed to fetch drivers: ${error.message}`);
  }
  
  return data || [];
}

/**
 * Map API status to database status
 */
function mapStatusToDb(status: 'pending' | 'active' | 'completed' | 'cancelled'): string {
  switch (status) {
    case 'pending':
      return 'NEW';
    case 'active':
      return 'ASSIGNED';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return 'NEW';
  }
}
