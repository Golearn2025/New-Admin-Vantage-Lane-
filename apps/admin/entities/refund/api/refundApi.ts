/**
 * Refund Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { Refund, RefundListItem, CreateRefundRequest, RefundListRequest } from '../model/types';

/**
 * List all refunds
 */
export async function listRefunds(filters?: RefundListRequest): Promise<RefundListItem[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('refunds')
    .select(`
      *,
      bookings!inner(
        reference,
        customers(
          first_name,
          last_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Transform to RefundListItem format
  return (data || []).map((refund: any) => ({
    id: refund.id,
    bookingReference: refund.bookings?.reference || 'N/A',
    customerName: refund.bookings?.customers
      ? `${refund.bookings.customers.first_name || ''} ${refund.bookings.customers.last_name || ''}`.trim()
      : 'Unknown',
    amount: Math.round(Number(refund.amount) * 100), // Convert to pence
    currency: refund.currency || 'GBP',
    reason: refund.reason,
    status: refund.status,
    createdAt: refund.created_at,
  }));
}

/**
 * Get refund by ID
 */
export async function getRefundById(id: string): Promise<Refund | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('refunds')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new refund
 */
export async function createRefund(
  payload: CreateRefundRequest
): Promise<Refund> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('refunds')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update refund
 */
export async function updateRefund(
  id: string,
  payload: Partial<Refund>
): Promise<Refund> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('refunds')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete refund
 */
export async function deleteRefund(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('refunds')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
