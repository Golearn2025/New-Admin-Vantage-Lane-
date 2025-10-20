/**
 * Bookings List API - Query Builder
 * Fetch data SEPARATE (nu nested) - funcționează 100%
 * Compliant: <150 lines
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { QueryParams, QueryResult, RawBooking } from './types';

export async function fetchBookingsData(
  supabase: SupabaseClient,
  params: QueryParams
): Promise<QueryResult> {
  const { page, pageSize, status } = params;

  // Base query - FĂRĂ nested (fetch separat!)
  let query = supabase.from('bookings').select('*', { count: 'exact' });

  if (status) {
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
      pricing: [],
      services: [],
    };
  }

  const bookingIds = bookings.map((b) => b.id);
  const customerIds = Array.from(
    new Set(bookings.map((b) => b.customer_id).filter(Boolean))
  ) as string[];

  // Fetch related data IN PARALLEL
  const [customersResult, segmentsResult, pricingResult, servicesResult] = await Promise.all([
    fetchCustomers(supabase, customerIds as string[]),
    fetchSegments(supabase, bookingIds),
    fetchPricing(supabase, bookingIds),
    fetchServices(supabase, bookingIds),
  ]);

  return {
    bookings: bookings as RawBooking[],
    totalCount: count || 0,
    customers: customersResult,
    segments: segmentsResult,
    pricing: pricingResult,
    services: servicesResult,
  };
}

async function fetchCustomers(supabase: SupabaseClient, customerIds: string[]) {
  if (customerIds.length === 0) return [];

  const { data, error } = await supabase
    .from('customers')
    .select(
      'id, first_name, last_name, phone, email, total_rides, loyalty_tier, status, total_spent'
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

async function fetchPricing(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_pricing')
    .select('booking_id, price, currency, payment_method, payment_status')
    .in('booking_id', bookingIds);

  if (error) {
    throw new Error(`Failed to fetch pricing: ${error.message}`);
  }

  return data || [];
}

async function fetchServices(supabase: SupabaseClient, bookingIds: string[]) {
  const { data, error } = await supabase
    .from('booking_services')
    .select('booking_id, service_code, unit_price, quantity')
    .in('booking_id', bookingIds)
    .gt('unit_price', 0); // Only paid services

  if (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }

  return data || [];
}

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
