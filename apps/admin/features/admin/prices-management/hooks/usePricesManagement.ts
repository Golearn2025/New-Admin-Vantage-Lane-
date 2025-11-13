/**
 * Prices Management Hook
 * 
 * Manages pricing configuration state and updates.
 * SWR-based data fetching with optimistic updates.
 * 
 * Ver 2.4: Debug console.log removed, production-ready
 */

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  fetchPricingConfig,
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
import {
  handleUpdateVehicleType as handleUpdateVehicleTypeDelegate,
  handleUpdateAirportFee as handleUpdateAirportFeeDelegate,
  handleUpdateZoneFee as handleUpdateZoneFeeDelegate,
  handleUpdateServicePolicies as handleUpdateServicePoliciesDelegate,
  handleUpdateGeneralPolicies as handleUpdateGeneralPoliciesDelegate,
  handleUpdateReturnSettings as handleUpdateReturnSettingsDelegate,
  handleUpdateHourlySettings as handleUpdateHourlySettingsDelegate,
  handleUpdateFleetSettings as handleUpdateFleetSettingsDelegate,
  handleUpdateTimeMultipliers as handleUpdateTimeMultipliersDelegate,
} from './handlers';

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

  const handleUpdateVehicleType = async (payload: UpdateVehicleTypePayload) => {
    if (!config) return;
    await handleUpdateVehicleTypeDelegate(config, mutate, setIsSaving, setSaveError, payload);
  };

  const handleUpdateAirportFee = async (payload: UpdateAirportFeePayload) => {
    if (!config) return;
    await handleUpdateAirportFeeDelegate(config, mutate, setIsSaving, setSaveError, payload);
  };

  const handleUpdateZoneFee = async (payload: { zoneCode: string; fee: Partial<ZoneFee> }) => {
    if (!config) return;
    await handleUpdateZoneFeeDelegate(config, mutate, setIsSaving, setSaveError, payload);
  };

  const handleUpdateServicePolicies = async (policies: ServicePolicies) => {
    if (!config) return;
    await handleUpdateServicePoliciesDelegate(config, mutate, setIsSaving, setSaveError, policies);
  };

  const handleUpdateGeneralPolicies = async (policies: GeneralPolicies) => {
    if (!config) return;
    await handleUpdateGeneralPoliciesDelegate(config, mutate, setIsSaving, setSaveError, policies);
  };

  const handleUpdateReturnSettings = async (settings: ReturnSettings) => {
    if (!config) return;
    await handleUpdateReturnSettingsDelegate(config, mutate, setIsSaving, setSaveError, settings);
  };

  const handleUpdateHourlySettings = async (settings: HourlySettings) => {
    if (!config) return;
    await handleUpdateHourlySettingsDelegate(config, mutate, setIsSaving, setSaveError, settings);
  };

  const handleUpdateFleetSettings = async (settings: FleetSettings) => {
    if (!config) return;
    await handleUpdateFleetSettingsDelegate(config, mutate, setIsSaving, setSaveError, settings);
  };

  const handleUpdateTimeMultipliers = async (
    multipliers: PricingConfig['time_multipliers']
  ) => {
    if (!config) return;
    await handleUpdateTimeMultipliersDelegate(config, mutate, setIsSaving, setSaveError, multipliers);
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
    updateTimeMultipliers: handleUpdateTimeMultipliers,
    refresh: mutate,
  };
}
