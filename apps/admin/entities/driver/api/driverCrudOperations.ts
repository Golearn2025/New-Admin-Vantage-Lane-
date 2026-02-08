/**
 * Driver CRUD Operations
 * Basic create, read, update, delete operations for drivers
 */

import { createClient } from '@/lib/supabase/client';
import type {
    CreateDriverPayload,
    DriverData,
    DriverRow,
    UpdateDriverPayload,
} from '../model/types';

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
    .select('id, email, first_name, last_name, phone, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

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

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  return mapDriverRow(data);
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
    .insert({
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone,
    })
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
    .update({
      ...(payload.first_name && { first_name: payload.first_name }),
      ...(payload.last_name && { last_name: payload.last_name }),
      ...(payload.phone && { phone: payload.phone }),
      ...(payload.is_active !== undefined && { is_active: payload.is_active }),
    })
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
