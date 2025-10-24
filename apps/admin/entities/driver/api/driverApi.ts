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
