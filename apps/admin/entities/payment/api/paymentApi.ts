/**
 * Payment Entity - API Interface
 * TODO: Implement payment API functions
 */

import type { Payment } from '../model/types';
import { createClient } from '@/lib/supabase/client';

export async function listPayments(): Promise<Payment[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('payments').select('*');
  if (error) throw error;
  return data as Payment[];
}

export async function getPayment(id: string): Promise<Payment | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Payment;
}
