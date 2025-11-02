/**
 * Payment Entity - Create Payment Intent
 * 
 * Creates a Stripe PaymentIntent for booking payment
 * Connects to YOUR Stripe account
 */

import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/client';

interface CreatePaymentIntentParams {
  bookingId: string;
  amount: number; // Amount in GBP (e.g., 25.50)
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const { bookingId, amount, currency = 'gbp', customerId, metadata = {} } = params;
  
  try {
    // 1. Create PaymentIntent in Stripe
    const paymentIntentParams: any = {
      amount: Math.round(amount * 100), // Convert £25.50 → 2550 pence
      currency,
      metadata: {
        booking_id: bookingId,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true, // Allow cards, wallets, etc.
      },
    };
    
    // Add customer only if provided (avoid undefined in strict mode)
    if (customerId) {
      paymentIntentParams.customer = customerId;
    }
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    
    // 2. Save transaction to database
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        booking_id: bookingId,
        stripe_payment_intent_id: paymentIntent.id,
        amount,
        currency,
        status: 'pending',
        stripe_status: paymentIntent.status,
        created_at: new Date().toISOString(),
      });
    
    if (dbError) {
      console.error('[Payment] Failed to save transaction:', dbError);
      // Don't throw - payment intent already created in Stripe
    }
    
    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('[Payment] Failed to create payment intent:', error);
    throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
