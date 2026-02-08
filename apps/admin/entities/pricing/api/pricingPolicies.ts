/**
 * Pricing Policies Management
 * 
 * Service policies, general policies, and various settings management
 */

import { createClient } from '@/lib/supabase/client';
import type { PricingConfig } from '../model/types';

/**
 * Update service policies
 */
export async function updateServicePolicies(
  configId: string,
  policies: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      service_policies: policies,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update service policies: ${error.message}`);
  }
}

/**
 * Update general policies
 */
export async function updateGeneralPolicies(
  configId: string,
  policies: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      general_policies: policies,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update general policies: ${error.message}`);
  }
}

/**
 * Update return settings
 */
export async function updateReturnSettings(
  configId: string,
  settings: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      return_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update return settings: ${error.message}`);
  }
}

/**
 * Update hourly settings
 */
export async function updateHourlySettings(
  configId: string,
  settings: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      hourly_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update hourly settings: ${error.message}`);
  }
}

/**
 * Update daily settings
 */
export async function updateDailySettings(
  configId: string,
  settings: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      daily_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update daily settings: ${error.message}`);
  }
}

/**
 * Update fleet settings
 */
export async function updateFleetSettings(
  configId: string,
  settings: any
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      fleet_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update fleet settings: ${error.message}`);
  }
}

/**
 * Update time-based multipliers
 */
export async function updateTimeMultipliers(
  configId: string,
  multipliers: PricingConfig['time_multipliers']
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      time_multipliers: multipliers,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update time multipliers: ${error.message}`);
  }
}

/**
 * Update event-based multipliers
 */
export async function updateEventMultipliers(
  configId: string,
  multipliers: PricingConfig['event_multipliers']
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      event_multipliers: multipliers,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update event multipliers: ${error.message}`);
  }
}

/**
 * Update premium services
 */
export async function updatePremiumServices(
  configId: string,
  services: PricingConfig['premium_services']
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      premium_services: services,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update premium services: ${error.message}`);
  }
}

/**
 * Update time period config
 */
export async function updateTimePeriodConfig(
  configId: string,
  config: PricingConfig['time_period_config']
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_config')
    .update({
      time_period_config: config,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update time period config: ${error.message}`);
  }
}
