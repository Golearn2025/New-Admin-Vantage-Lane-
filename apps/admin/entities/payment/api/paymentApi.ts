/**
 * Payment Entity - API Interface
 */

import { createClient } from '@/lib/supabase/client';
import { PaymentSchema } from '../model/schema';
import type { Payment, PaymentStatus } from '../model/schema';

/**
 * Map booking_pricing status to valid PaymentStatus
 */
function mapToPaymentStatus(status: string | null): PaymentStatus {
  if (!status) return 'pending';
  
  const statusMap: Record<string, PaymentStatus> = {
    'completed': 'captured',
    'paid': 'captured',
    'success': 'captured',
    'pending': 'pending',
    'processing': 'authorized',
    'failed': 'failed',
    'refunded': 'refunded',
  };
  
  const normalized = status.toLowerCase();
  return statusMap[normalized] || 'pending';
}

export async function listPayments(): Promise<Payment[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('booking_pricing').select('*').limit(200);
  if (error) throw error;
  return data.map((item) => PaymentSchema.parse({
    id: item.booking_id,
    bookingId: item.booking_id,
    amount: Math.round(item.price * 100),
    currency: 'GBP',
    status: mapToPaymentStatus(item.payment_status),
    paymentMethod: item.payment_method || 'CARD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function getPayment(id: string): Promise<Payment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('booking_pricing')
    .select('*')
    .eq('booking_id', id)
    .single();
  if (error) throw error;
  return PaymentSchema.parse({
    id: data.booking_id,
    bookingId: data.booking_id,
    amount: Math.round(data.price * 100),
    currency: 'GBP',
    status: mapToPaymentStatus(data.payment_status),
    paymentMethod: data.payment_method || 'CARD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<Payment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('booking_pricing')
    .update({ payment_status: status })
    .eq('booking_id', id)
    .select()
    .single();
  if (error) throw error;
  return PaymentSchema.parse({
    id: data.booking_id,
    bookingId: data.booking_id,
    amount: Math.round(data.price * 100),
    currency: 'GBP',
    status: mapToPaymentStatus(data.payment_status),
    paymentMethod: data.payment_method || 'CARD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
