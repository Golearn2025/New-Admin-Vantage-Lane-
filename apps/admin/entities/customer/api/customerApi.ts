/**
 * Customer Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { CustomerData, CustomerRow, CreateCustomerPayload, UpdateCustomerPayload } from '../model/types';

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
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

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
