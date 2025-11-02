/**
 * Stripe Server-side Client
 * Used for backend API calls (payments, refunds, invoices)
 * 
 * SECURITY: This uses SECRET key - NEVER expose to client!
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with your account
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover', // Latest API version for Stripe v19.2.0
  typescript: true,
  appInfo: {
    name: 'Vantage Lane Admin',
    version: '1.0.0',
  },
});

// Helper to check if we're in test mode
export const isTestMode = process.env.STRIPE_MODE === 'test' || 
                         process.env.STRIPE_SECRET_KEY?.includes('_test_');

// Log mode on startup (helps debugging)
if (process.env.NODE_ENV === 'development') {
  console.log(`[Stripe] Running in ${isTestMode ? 'TEST' : 'PRODUCTION'} mode`);
}
