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
  updateZoneFee,
  updateServicePolicies,
  updateGeneralPolicies,
  updateReturnSettings,
  updateHourlySettings,
  updateFleetSettings,
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
    console.log('🟢 usePricesManagement: handleUpdateVehicleType called');
    console.log('🟢 config:', config);
    console.log('🟢 payload:', payload);
    
    if (!config) {
      console.error('❌ No config available!');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('🟢 Calling updateVehicleType API...');
      await updateVehicleType(config.id, payload);
      console.log('🟢 updateVehicleType API success!');
      
      console.log('🟢 Invalidating cache...');
      await invalidatePricingCache();
      console.log('🟢 Cache invalidated!');
      
      // Wait a bit for Supabase to propagate changes
      console.log('🟢 Waiting for Supabase propagation...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🟢 Mutating SWR with revalidate...');
      await mutate(undefined, { revalidate: true });
      console.log('🟢 SWR mutated!');
      
      // Show success message
      alert('✅ Prices updated successfully!');
    } catch (err) {
      console.error('❌ Error in handleUpdateVehicleType:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      
      alert('✅ Airport fee updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update zone fee
   */
  const handleUpdateZoneFee = async (payload: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateZoneFee(config.id, payload);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ Zone fee updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update service policies
   */
  const handleUpdateServicePolicies = async (policies: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateServicePolicies(config.id, policies);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ Service policies updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update general policies
   */
  const handleUpdateGeneralPolicies = async (policies: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateGeneralPolicies(config.id, policies);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ General policies updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update return settings
   */
  const handleUpdateReturnSettings = async (settings: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateReturnSettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ Return settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update hourly settings
   */
  const handleUpdateHourlySettings = async (settings: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateHourlySettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ Hourly settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update fleet settings
   */
  const handleUpdateFleetSettings = async (settings: any) => {
    if (!config) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateFleetSettings(config.id, settings);
      await invalidatePricingCache();
      await new Promise(resolve => setTimeout(resolve, 500));
      await mutate(undefined, { revalidate: true });
      alert('✅ Fleet settings updated successfully!');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update');
      alert(`❌ Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
