/**
 * Invoice Entity - API Layer
 * 
 * Supabase data operations
 */

import { createClient } from '@/lib/supabase/client';
import type { Invoice, InvoiceListItem, CreateInvoiceRequest, InvoiceListRequest } from '../model/types';

/**
 * List all invoices
 */
export async function listInvoices(filters?: InvoiceListRequest): Promise<InvoiceListItem[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('payment_transactions')
    .select(`
      *,
      bookings!inner(
        reference,
        customers(
          first_name,
          last_name,
          email
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

  // Transform to InvoiceListItem format
  return (data || []).map((payment: any) => ({
    id: payment.id,
    invoiceNumber: payment.transaction_ref || payment.bookings?.reference || `INV-${payment.id.slice(0, 8)}`,
    bookingReference: payment.bookings?.reference || 'N/A',
    customerName: payment.bookings?.customers
      ? `${payment.bookings.customers.first_name || ''} ${payment.bookings.customers.last_name || ''}`.trim()
      : 'Unknown',
    total: Math.round(Number(payment.amount) * 100), // Convert to pence
    currency: payment.currency || 'GBP',
    status: (payment.status === 'paid' || payment.status === 'refunded') ? 'paid' : payment.status === 'pending' ? 'sent' : 'overdue',
    dueDate: payment.created_at,
    createdAt: payment.created_at,
  }));
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Create new invoice
 */
export async function createInvoice(
  payload: CreateInvoiceRequest
): Promise<Invoice> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update invoice
 */
export async function updateInvoice(
  id: string,
  payload: Partial<Invoice>
): Promise<Invoice> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('payment_transactions')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete invoice
 */
export async function deleteInvoice(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('payment_transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
