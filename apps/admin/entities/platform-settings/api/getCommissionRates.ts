/**
 * Get Commission Rates API
 * Fetch global platform commission settings
 */

import { createClient } from '@/lib/supabase/client';
import type { CommissionRates } from '../model/types';

/**
 * Get current commission rates from platform_settings
 */
export async function getCommissionRates(): Promise<CommissionRates> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('platform_settings')
    .select('setting_value')
    .eq('setting_key', 'commission_rates')
    .single();

  if (error) {
    console.error('Get commission rates error:', error);
    throw new Error(`Failed to fetch commission rates: ${error.message}`);
  }

  if (!data?.setting_value) {
    // Return defaults if not found
    return {
      platform_commission_pct: 15.0,
      default_operator_commission_pct: 20.0,
    };
  }

  return data.setting_value as CommissionRates;
}
