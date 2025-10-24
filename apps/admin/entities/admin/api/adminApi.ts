/**
 * Admin Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { AdminData, CreateAdminPayload, UpdateAdminPayload } from '../model/types';

/**
 * List all admins
 */
export async function listAdmins(): Promise<AdminData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  return data || [];
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: string): Promise<AdminData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new admin
 */
export async function createAdmin(
  payload: CreateAdminPayload
): Promise<AdminData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('admins')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
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
    .from('admins')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete admin
 */
export async function deleteAdmin(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('admins')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
