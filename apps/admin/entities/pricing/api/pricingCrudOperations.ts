/**
 * Pricing CRUD Operations
 * 
 * Basic configuration fetching and cache management operations
 */

import { createClient } from '@/lib/supabase/client';
import type { PricingConfig } from '../model/types';

/**
 * Fetch active pricing configuration
 */
export async function fetchPricingConfig(): Promise<PricingConfig> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pricing_config')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Failed to fetch pricing config: ${error.message}`);
  }

  if (!data) {
    throw new Error('No active pricing configuration found');
  }

  return data as PricingConfig;
}

/**
 * Invalidate Backend Pricing cache
 * OPTIONAL - Nu blochează dacă backend-ul nu rulează
 */
export async function invalidatePricingCache(): Promise<void> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PRICING_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${backendUrl}/api/cache/invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('⚠️ Failed to invalidate backend cache (backend might not be running)');
    } else {
      console.log('✅ Backend cache invalidated successfully');
    }
  } catch (error) {
    // Backend nu rulează - nu e o problemă critică
    console.warn('⚠️ Backend pricing service not available (this is OK for development):', error);
    // NU throw error - continuă fără invalidare cache
  }
}
