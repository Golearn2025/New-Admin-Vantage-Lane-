/**
 * Stripe Connection Test
 * Run: npx tsx apps/admin/scripts/test-stripe.ts
 * 
 * Verifică conexiunea cu contul vostru Stripe
 */

import { stripe } from '../lib/stripe/server';

async function testStripeConnection() {
  try {
    
    // 1. Create test product
    const product = await stripe.products.create({
      name: 'Test Product - Connection Check',
      description: 'Testing Vantage Lane → Stripe connection',
    });
    
    
    // 2. Create test price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2500, // £25.00
      currency: 'gbp',
    });
    
    
    // 3. Cleanup - delete test data
    await stripe.products.del(product.id);
    
    
  } catch (error) {
    process.exit(1);
  }
}

testStripeConnection();
