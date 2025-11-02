/**
 * Stripe Client-side
 * Used for frontend (payment forms, card elements)
 * 
 * SAFE: Uses PUBLISHABLE key (safe to expose)
 */

'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe.js instance (cached)
 * Only loads once per page load
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
