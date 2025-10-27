/**
 * Pricing Entity - API Client
 * 
 * Supabase API calls for pricing configuration
 */

import { createClient } from '@/lib/supabase/client';
import type { PricingConfig, UpdateVehicleTypePayload, UpdateAirportFeePayload } from '../model/types';

const supabase = createClient();

/**
 * Fetch active pricing configuration
 */
export async function fetchPricingConfig(): Promise<PricingConfig> {
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
  const { vehicleType, rates } = payload;

  // Fetch current config
  const { data: currentConfig } = await supabase
    .from('pricing_config')
    .select('vehicle_types')
    .eq('id', configId)
    .single();

  if (!currentConfig) {
    throw new Error('Pricing config not found');
  }

  // Merge rates
  const updatedVehicleTypes = {
    ...currentConfig.vehicle_types,
    [vehicleType]: {
      ...currentConfig.vehicle_types[vehicleType],
      ...rates,
    },
  };

  // Update
  const { error } = await supabase
    .from('pricing_config')
    .update({
      vehicle_types: updatedVehicleTypes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', configId);

  if (error) {
    throw new Error(`Failed to update vehicle type: ${error.message}`);
  }
}

/**
 * Update airport fee
 */
export async function updateAirportFee(
  configId: string,
  payload: UpdateAirportFeePayload
): Promise<void> {
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
 * Invalidate Backend Pricing cache
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
      throw new Error('Failed to invalidate cache');
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
    throw error;
  }
}
