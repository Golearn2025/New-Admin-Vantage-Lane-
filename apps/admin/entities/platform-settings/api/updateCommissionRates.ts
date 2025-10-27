/**
 * Update Commission Rates API
 * Update global platform commission settings
 */

import { createClient } from '@/lib/supabase/client';
import type { UpdateCommissionRatesPayload } from '../model/types';

/**
 * Update commission rates in platform_settings
 */
export async function updateCommissionRates(
  payload: UpdateCommissionRatesPayload
): Promise<{ success: boolean }> {
  const supabase = createClient();

  const settingValue = {
    platform_commission_pct: payload.platformCommissionPct,
    default_operator_commission_pct: payload.defaultOperatorCommissionPct,
  };

  const { error } = await supabase
    .from('platform_settings')
    .update({
      setting_value: settingValue,
      updated_by: payload.updatedBy,
      updated_at: new Date().toISOString(),
    })
    .eq('setting_key', 'commission_rates');

  if (error) {
    console.error('Update commission rates error:', error);
    throw new Error(`Failed to update commission rates: ${error.message}`);
  }

  return { success: true };
}
