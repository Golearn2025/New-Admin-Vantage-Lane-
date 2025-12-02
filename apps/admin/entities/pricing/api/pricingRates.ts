/**
 * Pricing Rates Management
 * 
 * Vehicle types, airport fees, and zone fees management operations
 */

import { createClient } from '@/lib/supabase/client';
import type { UpdateVehicleTypePayload, UpdateAirportFeePayload } from '../model/types';

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
