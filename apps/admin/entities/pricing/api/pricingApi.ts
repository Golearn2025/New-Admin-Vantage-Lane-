/**
 * Pricing Entity - API Client
 * 
 * Supabase API calls for pricing configuration
 */

import { createClient } from '@/lib/supabase/client';
import type { PricingConfig, UpdateVehicleTypePayload, UpdateAirportFeePayload } from '../model/types';

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
 * Update vehicle type rates
 */
export async function updateVehicleType(
  configId: string,
  payload: UpdateVehicleTypePayload
): Promise<void> {
  const supabase = createClient();
  console.log('🟡 pricingApi: updateVehicleType called');
  console.log('🟡 configId:', configId);
  console.log('🟡 payload:', payload);
  
  // Check current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('🟡 Current user:', user?.id, user?.email);
  
  const { vehicleType, rates } = payload;

  // Fetch current config
  console.log('🟡 Fetching current config...');
  const { data: currentConfig, error: fetchError } = await supabase
    .from('pricing_config')
    .select('vehicle_types')
    .eq('id', configId)
    .single();

  if (fetchError) {
    console.error('❌ Fetch error:', fetchError);
    throw new Error(`Failed to fetch config: ${fetchError.message}`);
  }

  if (!currentConfig) {
    console.error('❌ Pricing config not found');
    throw new Error('Pricing config not found');
  }

  console.log('🟡 Current config:', currentConfig);

  // Merge rates
  const updatedVehicleTypes = {
    ...currentConfig.vehicle_types,
    [vehicleType]: {
      ...currentConfig.vehicle_types[vehicleType],
      ...rates,
    },
  };

  console.log('🟡 Updated vehicle types:', updatedVehicleTypes);

  // Update
  console.log('🟡 Updating Supabase...');
  const { error } = await supabase
    .from('pricing_config')
    .update({
      vehicle_types: updatedVehicleTypes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    console.error('❌ Update error:', error);
    throw new Error(`Failed to update vehicle type: ${error.message}`);
  }

  console.log('✅ Supabase update successful!');
}

/**
 * Update airport fee
 */
export async function updateAirportFee(
  configId: string,
  payload: UpdateAirportFeePayload
): Promise<void> {
  const supabase = createClient();
  const { airportCode, fee } = payload;

  // Fetch current config
  const { data: currentConfig } = await supabase
    .from('pricing_config')
    .select('airport_fees')
    .eq('id', configId)
    .single();

  if (!currentConfig) {
    throw new Error('Pricing config not found');
  }

  // Merge fees
  const updatedAirportFees = {
    ...currentConfig.airport_fees,
    [airportCode]: {
      ...currentConfig.airport_fees[airportCode],
      ...fee,
    },
  };

  // Update
  const { error } = await supabase
    .from('pricing_config')
    .update({
      airport_fees: updatedAirportFees,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update airport fee: ${error.message}`);
  }
}

/**
 * Update zone fee
 */
export async function updateZoneFee(
  configId: string,
  payload: { zoneCode: string; fee: any }
): Promise<void> {
  const supabase = createClient();
  const { zoneCode, fee } = payload;

  // Fetch current config
  const { data: currentConfig } = await supabase
    .from('pricing_config')
    .select('zone_fees')
    .eq('id', configId)
    .single();

  if (!currentConfig) {
    throw new Error('Pricing config not found');
  }

  const updatedZoneFees = {
    ...currentConfig.zone_fees,
    [zoneCode]: {
      ...currentConfig.zone_fees[zoneCode],
      ...fee,
    },
  };

  const { error } = await supabase
    .from('pricing_config')
    .update({
      zone_fees: updatedZoneFees,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update zone fee: ${error.message}`);
  }
}

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
