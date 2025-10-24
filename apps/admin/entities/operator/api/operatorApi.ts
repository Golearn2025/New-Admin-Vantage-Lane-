/**
 * Operator Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { OperatorData, CreateOperatorPayload, UpdateOperatorPayload } from '../model/types';

/**
 * List all operators
 */
export async function listOperators(): Promise<OperatorData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('operators')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  return data || [];
}

/**
 * Get operator by ID
 */
export async function getOperatorById(id: string): Promise<OperatorData | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('operators')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new operator
 */
export async function createOperator(
  payload: CreateOperatorPayload
): Promise<OperatorData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('operators')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
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
    .from('operators')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete operator
 */
export async function deleteOperator(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('operators')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
