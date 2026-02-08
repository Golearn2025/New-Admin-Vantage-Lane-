/**
 * Admin Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { AdminData, AdminRow, CreateAdminPayload, UpdateAdminPayload } from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapAdminRow(row: AdminRow): AdminData {
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
 * List all admins
 */
export async function listAdmins(): Promise<AdminData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, first_name, last_name, phone, is_active, created_at')
    .in('role', ['admin', 'super_admin'])
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;

  return (data || []).map(mapAdminRow);
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: string): Promise<AdminData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .in('role', ['admin', 'super_admin'])
    .single();

  if (error) throw error;

  return data ? mapAdminRow(data) : null;
}

/**
 * Create new admin
 */
export async function createAdmin(
  payload: CreateAdminPayload
): Promise<AdminData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return mapAdminRow(data);
}

/**
 * Update admin
 */
export async function updateAdmin(
  id: string,
  payload: UpdateAdminPayload
): Promise<AdminData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admin_users')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapAdminRow(data);
}

/**
 * Delete admin
 */
export async function deleteAdmin(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
