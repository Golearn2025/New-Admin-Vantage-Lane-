/**
 * Driver Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { DriverData, DriverRow, CreateDriverPayload, UpdateDriverPayload } from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapDriverRow(row: DriverRow): DriverData {
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
 * List all drivers
 */
export async function listDrivers(): Promise<DriverData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  return (data || []).map(mapDriverRow);
}

/**
 * Get driver by ID
 */
export async function getDriverById(id: string): Promise<DriverData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data ? mapDriverRow(data) : null;
}

/**
 * Create new driver
 */
export async function createDriver(
  payload: CreateDriverPayload
): Promise<DriverData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapDriverRow(data);
}

/**
 * Update driver
 */
export async function updateDriver(
  id: string,
  payload: UpdateDriverPayload
): Promise<DriverData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapDriverRow(data);
}

/**
 * Delete driver
 */
export async function deleteDriver(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get driver bookings (job history) with pricing, locations, and services
 */
export async function getDriverBookings(driverId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      pricing:booking_pricing(*),
      segments:booking_segments(*),
      services:booking_services(*)
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
    .select('*')
    .eq('assigned_driver_id', driverId);

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
