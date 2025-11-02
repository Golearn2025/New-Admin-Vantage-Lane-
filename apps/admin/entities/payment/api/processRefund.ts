/**
 * Payment Entity - Process Refund
 * 
 * Processes refunds via YOUR Stripe account
 * Implements refund policy from STRIPE.md
 */

import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/client';

export type RefundReason = 
  | 'client_cancellation'
  | 'driver_no_show'
  | 'service_issue'
  | 'duplicate'
  | 'fraudulent';

interface ProcessRefundParams {
  bookingId: string;
  reason: RefundReason;
  amount?: number; // Optional partial refund
  note?: string;
}

/**
 * Calculate refund amount based on policy (from STRIPE.md)
 */
function calculateRefundAmount(
  originalAmount: number,
  reason: RefundReason,
  scheduledAt: string
): number {
  // Full refund reasons (bypass time check)
  if (reason === 'driver_no_show' || reason === 'service_issue') {
    return originalAmount;
  }
  
  // Time-based refund policy
  const hoursUntilRide = (new Date(scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60);
  
  if (hoursUntilRide > 24) {
    return originalAmount; // 100% refund
  }
  if (hoursUntilRide > 2) {
    return originalAmount * 0.5; // 50% refund
  }
  
  return 0; // No refund <2h before ride
}

export async function processRefund(params: ProcessRefundParams) {
  const { bookingId, reason, amount, note } = params;
  
  const supabase = createClient();
  
  try {
    // 1. Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, payment_transactions(*)')
      .eq('id', bookingId)
      .single();
    
    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }
    
    // 2. Get successful payment transaction
    const transaction = booking.payment_transactions?.find(
      (t: any) => t.status === 'succeeded'
    );
    
    if (!transaction) {
      throw new Error('No successful payment found for this booking');
    }
    
    // 3. Calculate refund amount
    const refundAmount = amount || calculateRefundAmount(
      transaction.amount,
      reason,
      booking.start_at
    );
    
    if (refundAmount === 0) {
      throw new Error('No refund available - cancellation too late');
    }
    
    // 4. Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripe_payment_intent_id,
      amount: Math.round(refundAmount * 100), // Convert to pence
      reason: reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
      metadata: {
        booking_id: bookingId,
        reason,
        note: note || '',
      },
    });
    
    // 5. Update booking with refund info
    await supabase
      .from('bookings')
      .update({
        refund_status: 'processed',
        refund_amount: refundAmount,
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);
    
    // 6. Create audit log
    await supabase
      .from('booking_timeline')
      .insert({
        booking_id: bookingId,
        event_type: 'refund_processed',
        metadata: {
          refund_id: refund.id,
          amount: refundAmount,
          reason,
        },
        created_at: new Date().toISOString(),
      });
    
    return {
      refundId: refund.id,
      amount: refundAmount,
      status: refund.status,
      reason,
    };
  } catch (error) {
    console.error('[Payment] Failed to process refund:', error);
    throw new Error(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
