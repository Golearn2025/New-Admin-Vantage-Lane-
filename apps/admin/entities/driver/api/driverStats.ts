/**
 * Driver Stats and Data Operations
 * Bookings, vehicle data, and performance statistics
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Get driver bookings (job history) with pricing, locations, and services
 */
export async function getDriverBookings(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, reference, status, start_at, passenger_count, bag_count, trip_type, category, flight_number, distance_miles, duration_min,
      pricing:booking_pricing(price, currency, extras_total),
      segments:booking_segments(seq_no, role, place_text, place_label),
      services:booking_services(service_code, quantity, unit_price)
    `)
    .eq('assigned_driver_id', driverId)
    .order('start_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return data || [];
}

/**
 * Get driver assigned vehicle
 */
export async function getDriverVehicle(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('driver_id', driverId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  return data;
}

/**
 * Get driver stats (calculated from bookings)
 */
export async function getDriverStats(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('status')
    .eq('assigned_driver_id', driverId)
    .limit(5000);

  if (error) throw error;

  const bookings = data || [];
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  return {
    totalJobs: bookings.length,
    completedJobs: completedBookings.length,
    pendingJobs: bookings.filter(b => b.status === 'pending').length,
    totalEarnings: 0, // TODO: Calculate from payment data
    rating: 4.8, // TODO: Calculate from ratings
  };
}

/**
 * Get driver with all documents and vehicle
 * For driver verification page
 */
export async function getDriverWithDocuments(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select(`
      *,
      documents:driver_documents(*),
      vehicle:vehicles(*)
    `)
    .eq('id', driverId)
    .single();

  if (error) throw error;

  return data;
}
