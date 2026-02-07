/**
 * DEPRECATED: Bookings List API - Query Builder
 * 
 * ❌ THIS FILE IS DEPRECATED - DO NOT USE!
 * ✅ REPLACED BY: RPC get_bookings_list in Supabase
 * 
 * PERFORMANCE ISSUE: This file used 9 separate Promise.all queries
 * NEW SOLUTION: Single RPC call with joins
 * 
 * @deprecated Use app/api/bookings/list/route.ts which calls RPC instead
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryParams, QueryResult, RawBooking } from './listBookings.types';

// Use existing mapStatusToDb function (avoid duplicate)

export async function fetchBookingsData(
  supabase: SupabaseClient,
  params: QueryParams
): Promise<QueryResult> {
  const { page, pageSize, status, statusFilters } = params;

  // Base query - FĂRĂ nested (fetch separat!)
  let query = supabase.from('bookings').select('*', { count: 'exact' });

  // Apply status filtering
  if (statusFilters && statusFilters.length > 0) {
    // Multiple status filters (for Past page: completed, cancelled)
    const dbStatuses = statusFilters.map(s => mapStatusToDb(s));
    query = query.in('status', dbStatuses);
  } else if (status) {
    // Single status filter (for dropdown selection)
    const dbStatus = mapStatusToDb(status);
    query = query.eq('status', dbStatus);
  }

  query = query.order('created_at', { ascending: false });

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data: bookings, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  if (!bookings || bookings.length === 0) {
    return {
      bookings: [],
      totalCount: count || 0,
      customers: [],
      segments: [],
      legs: [],
      pricing: [],
      services: [],
      organizations: [],
      assignments: [],
      drivers: [],
      vehicles: [],
    };
  }

  const bookingIds = bookings.map((b) => b.id);
  const customerIds = Array.from(
    new Set(bookings.map((b) => b.customer_id).filter(Boolean))
  ) as string[];
  const organizationIds = Array.from(
    new Set(bookings.map((b) => b.organization_id).filter(Boolean))
  ) as string[];
  const driverIds = Array.from(
    new Set(bookings.map((b) => b.assigned_driver_id).filter(Boolean))
  ) as string[];
  const vehicleIds = Array.from(
    new Set(bookings.map((b) => b.assigned_vehicle_id).filter(Boolean))
  ) as string[];

  // Fetch related data IN PARALLEL
  const [
    customersResult,
    segmentsResult,
    legsResult,
    pricingResult,
    servicesResult,
    organizationsResult,
    assignmentsResult,
    driversResult,
    vehiclesResult,
  ] = await Promise.all([
    fetchCustomers(supabase, customerIds as string[]),
    fetchSegments(supabase, bookingIds),
    fetchLegs(supabase, bookingIds),
    fetchPricing(supabase, bookingIds),
    fetchServices(supabase, bookingIds),
    fetchOrganizations(supabase, organizationIds),
    fetchAssignments(supabase, bookingIds),
    fetchDrivers(supabase, driverIds),
    fetchVehicles(supabase, vehicleIds, driverIds),
  ]);

  return {
    bookings: bookings as RawBooking[],
    totalCount: count || 0,
    customers: customersResult,
    segments: segmentsResult,
    legs: legsResult,
    pricing: pricingResult,
    services: servicesResult,
    organizations: organizationsResult,
    assignments: assignmentsResult,
    drivers: driversResult,
    vehicles: vehiclesResult,
  };
}

async function fetchCustomers(supabase: SupabaseClient, customerIds: string[]) {
  if (customerIds.length === 0) return [];

  const { data, error } = await supabase
    .from('customers')
    .select(
      'id, first_name, last_name, phone, email, total_rides, loyalty_tier, status, total_spent, rating_average, rating_count'
    )
    .in('id', customerIds);

  if (error) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }

  return data || [];
}

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

async function fetchLegs(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_legs')
    .select(
      'id, parent_booking_id, leg_number, leg_type, vehicle_category, pickup_location, destination, scheduled_at, distance_miles, duration_min, assigned_driver_id, assigned_vehicle_id, status, leg_price, driver_payout, assigned_at, arrived_at_pickup, passenger_onboard_at, started_at, completed_at, cancelled_at, cancel_reason'
    )
    .in('parent_booking_id', bookingIds)
    .order('leg_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch legs: ${error.message}`);
  }

  return data || [];
}

async function fetchPricing(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_pricing')
    .select(
      'booking_id, price, currency, payment_method, payment_status, platform_fee, operator_net, driver_payout, platform_commission_pct, driver_commission_pct'
    )
    .in('booking_id', bookingIds);

  if (error) {
    throw new Error(`Failed to fetch pricing: ${error.message}`);
  }

  return data || [];
}

async function fetchServices(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_services')
    .select('booking_id, service_code, unit_price, quantity, notes')
    .in('booking_id', bookingIds);
  // ✅ FIXED: Include ALL services (free + paid)

  if (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }

  return data || [];
}

async function fetchOrganizations(supabase: SupabaseClient, orgIds: string[]) {
  if (orgIds.length === 0) return [];

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, rating_average, review_count')
    .in('id', orgIds);

  if (error) {
    throw new Error(`Failed to fetch organizations: ${error.message}`);
  }

  return data || [];
}

async function fetchAssignments(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_assignment')
    .select('booking_id, assigned_at, assigned_by')
    .in('booking_id', bookingIds);

  if (error) {
    throw new Error(`Failed to fetch assignments: ${error.message}`);
  }

  return data || [];
}

async function fetchDrivers(supabase: SupabaseClient, driverIds: string[]) {
  if (driverIds.length === 0) return [];

  const { data, error } = await supabase
    .from('drivers')
    .select('id, first_name, last_name, phone, email, rating_average')
    .in('id', driverIds);

  if (error) {
    throw new Error(`Failed to fetch drivers: ${error.message}`);
  }

  return data || [];
}

async function fetchVehicles(supabase: SupabaseClient, vehicleIds: string[], driverIds: string[]) {
  // Fetch by vehicle ID (assigned) OR by driver ID (fallback)
  const allIds = Array.from(new Set([...vehicleIds, ...driverIds]));
  if (allIds.length === 0) return [];

  const queries = [];

  // Fetch assigned vehicles by ID
  if (vehicleIds.length > 0) {
    queries.push(
      supabase
        .from('vehicles')
        .select('id, driver_id, make, model, year, color, license_plate')
        .in('id', vehicleIds)
    );
  }

  // Fetch driver's vehicles (for fallback when no assigned_vehicle_id)
  if (driverIds.length > 0) {
    queries.push(
      supabase
        .from('vehicles')
        .select('id, driver_id, make, model, year, color, license_plate')
        .in('driver_id', driverIds)
        .eq('is_active', true)
    );
  }

  const results = await Promise.all(queries);
  const allVehicles: any[] = [];
  for (const result of results) {
    if (result.error) {
      throw new Error(`Failed to fetch vehicles: ${result.error.message}`);
    }
    allVehicles.push(...(result.data || []));
  }

  // Deduplicate by vehicle ID
  const seen = new Set<string>();
  return allVehicles.filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
}

function mapStatusToDb(status: 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'): string {
  switch (status) {
    case 'pending':
      return 'NEW';
    case 'assigned':
      return 'ASSIGNED';
    case 'en_route':
      return 'EN_ROUTE';
    case 'arrived':
      return 'ARRIVED';
    case 'in_progress':
      return 'IN_PROGRESS';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return 'NEW';
  }
}
