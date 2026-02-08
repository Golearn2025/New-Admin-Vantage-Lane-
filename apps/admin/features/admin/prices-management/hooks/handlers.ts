import { invalidatePricingCache, updateAirportFee, updateDailySettings, updateEventMultipliers, updateFleetSettings, updateGeneralPolicies, updateHourlySettings, updatePremiumServices, updateReturnSettings, updateServicePolicies, updateTimeMultipliers, updateTimePeriodConfig, updateVehicleType, updateZoneFee, type DailySettings, type FleetSettings, type GeneralPolicies, type HourlySettings, type PricingConfig as PC, type PricingConfig, type ReturnSettings, type ServicePolicies, type UpdateAirportFeePayload, type UpdateVehicleTypePayload, type ZoneFee } from '@entities/pricing';

// Mutate function type definition
type MutateFunction<T = PricingConfig> = (data?: T, opts?: { revalidate?: boolean }) => Promise<T | undefined>;

/** Shared helper to standardize update flows */
async function performUpdate<T>(opts: {
  action: () => Promise<T>;
  mutate: MutateFunction;
  setIsSaving: (v: boolean) => void;
  setSaveError: (v: string | null) => void;
  successMessage: string;
}): Promise<void> {
  const { action, mutate, setIsSaving, setSaveError, successMessage } = opts;
  setIsSaving(true);
  setSaveError(null);
  try {
    await action();
    await invalidatePricingCache();
    await new Promise((r) => setTimeout(r, 500));
    await mutate(undefined, { revalidate: true });
    alert(successMessage);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update';
    setSaveError(msg);
    alert(`Failed to update: ${msg}`);
    throw err;
  } finally {
    setIsSaving(false);
  }
}

export async function handleUpdateVehicleType(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, payload: UpdateVehicleTypePayload) {
  await performUpdate({
    action: () => updateVehicleType(config.id, payload),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Prices updated successfully!',
  });
}

export async function handleUpdateAirportFee(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, payload: UpdateAirportFeePayload) {
  await performUpdate({
    action: () => updateAirportFee(config.id, payload),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Airport fee updated successfully!',
  });
}

export async function handleUpdateZoneFee(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, payload: { zoneCode: string; fee: Partial<ZoneFee> }) {
  await performUpdate({
    action: () => updateZoneFee(config.id, payload),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Zone fee updated successfully!',
  });
}

export async function handleUpdateServicePolicies(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, policies: ServicePolicies) {
  await performUpdate({
    action: () => updateServicePolicies(config.id, policies),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Service policies updated successfully!',
  });
}

export async function handleUpdateGeneralPolicies(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, policies: GeneralPolicies) {
  await performUpdate({
    action: () => updateGeneralPolicies(config.id, policies),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: General policies updated successfully!',
  });
}

export async function handleUpdateReturnSettings(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, settings: ReturnSettings) {
  await performUpdate({
    action: () => updateReturnSettings(config.id, settings),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Return settings updated successfully!',
  });
}

export async function handleUpdateHourlySettings(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, settings: HourlySettings) {
  await performUpdate({
    action: () => updateHourlySettings(config.id, settings),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Hourly settings updated successfully!',
  });
}

export async function handleUpdateDailySettings(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, settings: DailySettings) {
  await performUpdate({
    action: () => updateDailySettings(config.id, settings),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Daily settings updated successfully!',
  });
}

export async function handleUpdateFleetSettings(config: PricingConfig, mutate: MutateFunction, setIsSaving: (v: boolean) => void, setSaveError: (v: string | null) => void, settings: FleetSettings) {
  await performUpdate({
    action: () => updateFleetSettings(config.id, settings),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Fleet settings updated successfully!',
  });
}

export async function handleUpdateEventMultipliers(
  config: PricingConfig,
  mutate: MutateFunction,
  setIsSaving: (v: boolean) => void,
  setSaveError: (v: string | null) => void,
  multipliers: PC['event_multipliers']
) {
  await performUpdate({
    action: () => updateEventMultipliers(config.id, multipliers),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Event multipliers updated successfully!',
  });
}

export async function handleUpdatePremiumServices(
  config: PricingConfig,
  mutate: MutateFunction,
  setIsSaving: (v: boolean) => void,
  setSaveError: (v: string | null) => void,
  services: PC['premium_services']
) {
  await performUpdate({
    action: () => updatePremiumServices(config.id, services),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Premium services updated successfully!',
  });
}

export async function handleUpdateTimeMultipliers(
  config: PricingConfig,
  mutate: MutateFunction,
  setIsSaving: (v: boolean) => void,
  setSaveError: (v: string | null) => void,
  multipliers: PC['time_multipliers']
) {
  await performUpdate({
    action: () => updateTimeMultipliers(config.id, multipliers),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Time multipliers updated successfully!',
  });
}

export async function handleUpdateTimePeriodConfig(
  config: PricingConfig,
  mutate: MutateFunction,
  setIsSaving: (v: boolean) => void,
  setSaveError: (v: string | null) => void,
  timePeriodConfig: PC['time_period_config']
) {
  await performUpdate({
    action: () => updateTimePeriodConfig(config.id, timePeriodConfig),
    mutate,
    setIsSaving,
    setSaveError,
    successMessage: 'Success: Time period config updated successfully!',
  });
}
