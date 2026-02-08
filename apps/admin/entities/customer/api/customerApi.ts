/**
 * Customer Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { CreateCustomerPayload, CustomerData, CustomerRow, UpdateCustomerPayload } from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapCustomerRow(row: CustomerRow): CustomerData {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

/**
 * List all customers
 */
export async function listCustomers(): Promise<CustomerData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .select('id, email, first_name, last_name, phone, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  return (data || []).map(mapCustomerRow);
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<CustomerData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data ? mapCustomerRow(data) : null;
}

/**
 * Create new customer
 */
export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<CustomerData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapCustomerRow(data);
}

/**
 * Update customer
 */
export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload
): Promise<CustomerData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapCustomerRow(data);
}

/**
 * Delete customer
 */
export async function deleteCustomer(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get customer bookings (booking history) with pricing, locations, and services
 */
export async function getCustomerBookings(customerId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, reference, status, start_at, passenger_count, bag_count, trip_type, category, flight_number, distance_miles, duration_min,
      pricing:booking_pricing(price, currency, extras_total),
      segments:booking_segments(seq_no, role, place_text, place_label),
      services:booking_services(service_code, quantity, unit_price)
    `)
    .eq('customer_id', customerId)
    .order('start_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return data || [];
}

/**
 * Get customer stats (total bookings, spent, etc.)
 */
export async function getCustomerStats(customerId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('status')
    .eq('customer_id', customerId)
    .limit(5000);

  if (error) throw error;

  const bookings = data || [];
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return {
    totalBookings: bookings.length,
    completedBookings: completedBookings.length,
    pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
    cancelledBookings: bookings.filter(b => b.status === 'CANCELLED').length,
    totalSpent: 0, // TODO: Calculate from payment data
  };
}
