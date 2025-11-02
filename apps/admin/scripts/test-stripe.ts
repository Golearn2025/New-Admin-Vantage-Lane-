/**
 * Stripe Connection Test
 * Run: npx tsx apps/admin/scripts/test-stripe.ts
 * 
 * Verifică conexiunea cu contul vostru Stripe
 */

import { stripe } from '../lib/stripe/server';

async function testStripeConnection() {
  try {
    console.log('🔄 Testing Stripe connection...\n');
    
    // 1. Create test product
    const product = await stripe.products.create({
      name: 'Test Product - Connection Check',
      description: 'Testing Vantage Lane → Stripe connection',
    });
    
    console.log('✅ Product created:');
    console.log(`   ID: ${product.id}`);
    console.log(`   Name: ${product.name}\n`);
    
    // 2. Create test price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2500, // £25.00
      currency: 'gbp',
    });
    
    console.log('✅ Price created:');
    console.log(`   ID: ${price.id}`);
    console.log(`   Amount: £${price.unit_amount! / 100}\n`);
    
    // 3. Cleanup - delete test data
    await stripe.products.del(product.id);
    console.log('🧹 Test data cleaned up\n');
    
    console.log('🎉 SUCCESS! Stripe integration works!');
    console.log('Your Vantage Lane app is connected to your Stripe account.');
    
  } catch (error) {
    console.error('❌ FAILED! Stripe connection error:');
    console.error(error);
    process.exit(1);
  }
}

testStripeConnection();
