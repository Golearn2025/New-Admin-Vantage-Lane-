/**
 * Payment Entity - API Interface
 */

import { createClient } from '@/lib/supabase/client';
import { PaymentSchema } from '../model/schema';
import type { Payment, PaymentStatus } from '../model/schema';

export async function listPayments(): Promise<Payment[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('booking_pricing').select('*').limit(200);
  if (error) throw error;
  return data.map((item) => PaymentSchema.parse({
    id: item.booking_id,
    bookingId: item.booking_id,
    amount: Math.round(item.price * 100),
    currency: 'GBP',
    status: item.payment_status || 'pending',
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
    status: data.payment_status || 'pending',
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
    status: data.payment_status || 'pending',
    paymentMethod: data.payment_method || 'CARD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
