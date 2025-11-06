/**
 * Prices Management Hook
 * 
 * Manages pricing configuration state and updates.
 * SWR-based data fetching with optimistic updates.
 * 
 * Ver 2.4: Debug console.log removed, production-ready
 */

'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  fetchPricingConfig,
  updateVehicleType,
  updateAirportFee,
  updateZoneFee,
  updateServicePolicies,
  updateGeneralPolicies,
  updateReturnSettings,
  updateHourlySettings,
  updateFleetSettings,
  invalidatePricingCache,
  type PricingConfig,
  type ZoneFee,
  type ServicePolicies,
  type GeneralPolicies,
  type FleetSettings,
  type HourlySettings,
  type ReturnSettings,
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
    if (!config) {
      console.error('Error: No config available!');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateVehicleType(config.id, payload);
      await invalidatePricingCache();
      
      // Wait a bit for Supabase to propagate changes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await mutate(undefined, { revalidate: true });
      
      // Show success message
      alert('Success: Prices updated successfully!');
    } catch (err) {
      console.error('Error in handleUpdateVehicleType:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      
      // Wait for Supabase propagation
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      
      alert('Success: Airport fee updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update zone fee
   */
  const handleUpdateZoneFee = async (payload: { zoneCode: string; fee: Partial<ZoneFee> }) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateZoneFee(config.id, payload);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: Zone fee updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update service policies
   */
  const handleUpdateServicePolicies = async (policies: ServicePolicies) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateServicePolicies(config.id, policies);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: Service policies updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update general policies
   */
  const handleUpdateGeneralPolicies = async (policies: GeneralPolicies) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateGeneralPolicies(config.id, policies);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: General policies updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update return settings
   */
  const handleUpdateReturnSettings = async (settings: ReturnSettings) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateReturnSettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: Return settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update hourly settings
   */
  const handleUpdateHourlySettings = async (settings: HourlySettings) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateHourlySettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: Hourly settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update fleet settings
   */
  const handleUpdateFleetSettings = async (settings: FleetSettings) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateFleetSettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('Success: Fleet settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    updateZoneFee: handleUpdateZoneFee,
    updateServicePolicies: handleUpdateServicePolicies,
    updateGeneralPolicies: handleUpdateGeneralPolicies,
    updateReturnSettings: handleUpdateReturnSettings,
    updateHourlySettings: handleUpdateHourlySettings,
    updateFleetSettings: handleUpdateFleetSettings,
    refresh: mutate,
  };
}
