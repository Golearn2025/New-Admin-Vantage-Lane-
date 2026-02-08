/**
 * Operator Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { CreateOperatorPayload, OperatorData, OperatorRow, UpdateOperatorPayload } from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapOperatorRow(row: OperatorRow): OperatorData {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    city: row.city,
    isActive: row.is_active,
    ratingAverage: row.rating_average ? parseFloat(row.rating_average) : null,
    createdAt: row.created_at,
  };
}

/**
 * List all operators
 */
export async function listOperators(): Promise<OperatorData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .select('id, code, name, contact_email, contact_phone, city, is_active, rating_average, created_at')
    .eq('org_type', 'operator')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  return (data || []).map(mapOperatorRow);
}

/**
 * Get operator by ID
 */
export async function getOperatorById(id: string): Promise<OperatorData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .eq('org_type', 'operator')
    .single();

  if (error) throw error;

  return data ? mapOperatorRow(data) : null;
}

/**
 * Create new operator
 */
export async function createOperator(
  payload: CreateOperatorPayload
): Promise<OperatorData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapOperatorRow(data);
}

/**
 * Update operator
 */
export async function updateOperator(
  id: string,
  payload: UpdateOperatorPayload
): Promise<OperatorData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizations')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapOperatorRow(data);
}

/**
 * Delete operator
 */
export async function deleteOperator(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id)
    .eq('org_type', 'operator');

  if (error) throw error;
}

/**
 * Get all drivers for an operator
 */
export async function getOperatorDrivers(operatorId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select('id, email, first_name, last_name, phone, is_active, status, created_at')
    .eq('organization_id', operatorId)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  return data || [];
}

/**
 * Get operator stats (drivers, vehicles, bookings)
 */
export async function getOperatorStats(operatorId: string) {
  const supabase = createClient();

  // Get drivers count (head:true = no rows transferred, only count)
  const { count: driversCount, error: driversError } = await supabase
    .from('drivers')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', operatorId);

  if (driversError) throw driversError;

  // Get vehicles count
  const { count: vehiclesCount, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', operatorId);

  if (vehiclesError) throw vehiclesError;

  // Get bookings count
  const { count: bookingsCount, error: bookingsError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', operatorId);

  if (bookingsError) throw bookingsError;

  return {
    totalDrivers: driversCount || 0,
    totalVehicles: vehiclesCount || 0,
    totalBookings: bookingsCount || 0,
    activeDrivers: 0, // TODO: Calculate from driver status
  };
}
