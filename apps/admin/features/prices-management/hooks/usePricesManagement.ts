/**
 * Prices Management Hook
 * 
 * Manages pricing configuration state and updates
 */

'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  fetchPricingConfig,
  updateVehicleType,
  updateAirportFee,
  invalidatePricingCache,
  type PricingConfig,
  type UpdateVehicleTypePayload,
  type UpdateAirportFeePayload,
} from '@entities/pricing';

export function usePricesManagement() {
  const { data: config, error, mutate } = useSWR<PricingConfig>(
    'pricing-config',
    fetchPricingConfig,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Update vehicle type rates
   */
  const handleUpdateVehicleType = async (payload: UpdateVehicleTypePayload) => {
    if (!config) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateVehicleType(config.id, payload);
      await invalidatePricingCache();
      await mutate();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update airport fee
   */
  const handleUpdateAirportFee = async (payload: UpdateAirportFeePayload) => {
    if (!config) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateAirportFee(config.id, payload);
      await invalidatePricingCache();
      await mutate();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    loading: !config && !error,
    error: error || saveError,
    isSaving,
    updateVehicleType: handleUpdateVehicleType,
    updateAirportFee: handleUpdateAirportFee,
    refresh: mutate,
  };
}
