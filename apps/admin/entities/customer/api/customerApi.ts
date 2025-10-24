/**
 * Customer Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { CustomerData, CreateCustomerPayload, UpdateCustomerPayload } from '../model/types';

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

  return data || [];
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

  return data;
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

  return data;
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

  return data;
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
