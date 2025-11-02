/**
 * Dispute Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { Dispute, DisputeListItem, SubmitEvidenceRequest, DisputeListRequest } from '../model/types';

/**
 * List all disputes
 */
export async function listDisputes(filters?: DisputeListRequest): Promise<DisputeListItem[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('disputes')
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

  // Transform to DisputeListItem format
  return (data || []).map((dispute: any) => ({
    id: dispute.id,
    bookingReference: dispute.bookings?.reference || 'N/A',
    customerName: dispute.bookings?.customers
      ? `${dispute.bookings.customers.first_name || ''} ${dispute.bookings.customers.last_name || ''}`.trim()
      : 'Unknown',
    amount: Math.round(Number(dispute.amount) * 100), // Convert to pence
    currency: dispute.currency || 'GBP',
    reason: dispute.reason || 'unrecognized',
    status: dispute.status,
    evidenceDueBy: dispute.due_by,
    createdAt: dispute.created_at,
  }));
}

/**
 * Get dispute by ID
 */
export async function getDisputeById(id: string): Promise<Dispute | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('disputes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new dispute
 */
export async function createDispute(
  payload: Partial<Dispute>
): Promise<Dispute> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('disputes')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update dispute
 */
export async function updateDispute(
  id: string,
  payload: Partial<Dispute>
): Promise<Dispute> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('disputes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete dispute
 */
export async function deleteDispute(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('disputes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
