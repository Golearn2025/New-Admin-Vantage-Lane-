/**
 * Operator Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { OperatorData, OperatorRow, CreateOperatorPayload, UpdateOperatorPayload } from '../model/types';

/**
 * Map database row (snake_case) to app data (camelCase)
 */
function mapOperatorRow(row: OperatorRow): OperatorData {
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

  return (data || []).map(mapOperatorRow);
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
    .from('operators')
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
    .from('operators')
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
    .from('operators')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
