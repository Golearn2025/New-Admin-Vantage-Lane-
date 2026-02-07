/**
 * Prices Management Hook
 * 
 * Manages pricing configuration state and updates.
 * SWR-based data fetching with optimistic updates.
 * 
 * Ver 2.4: Debug console.log removed, production-ready
 */

'use client';

import {
    fetchPricingConfig,
    type DailySettings,
    type FleetSettings,
    type GeneralPolicies,
    type HourlySettings,
    type PricingConfig,
    type ReturnSettings,
    type ServicePolicies,
    type UpdateAirportFeePayload,
    type UpdateVehicleTypePayload,
    type ZoneFee
} from '@entities/pricing';
import { useState } from 'react';
import useSWR from 'swr';
import {
    handleUpdateAirportFee as handleUpdateAirportFeeDelegate,
    handleUpdateDailySettings as handleUpdateDailySettingsDelegate,
    handleUpdateFleetSettings as handleUpdateFleetSettingsDelegate,
    handleUpdateGeneralPolicies as handleUpdateGeneralPoliciesDelegate,
    handleUpdateHourlySettings as handleUpdateHourlySettingsDelegate,
    handleUpdateReturnSettings as handleUpdateReturnSettingsDelegate,
    handleUpdateServicePolicies as handleUpdateServicePoliciesDelegate,
    handleUpdateTimeMultipliers as handleUpdateTimeMultipliersDelegate,
    handleUpdateVehicleType as handleUpdateVehicleTypeDelegate,
    handleUpdateZoneFee as handleUpdateZoneFeeDelegate
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

  const handleUpdateDailySettings = async (settings: DailySettings) => {
    if (!config) return;
    await handleUpdateDailySettingsDelegate(config, mutate, setIsSaving, setSaveError, settings);
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
    updateDailySettings: handleUpdateDailySettings,
    updateFleetSettings: handleUpdateFleetSettings,
    updateTimeMultipliers: handleUpdateTimeMultipliers,
    refresh: mutate,
  };
}
