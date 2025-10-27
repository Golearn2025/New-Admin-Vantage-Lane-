/**
 * Platform Settings Entity - Types
 * Global platform configuration
 */

export interface PlatformSettings {
  id: string;
  settingKey: string;
  settingValue: CommissionRates;
  description: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRates {
  platform_commission_pct: number;
  default_operator_commission_pct: number;
}

export interface UpdateCommissionRatesPayload {
  platformCommissionPct: number;
  defaultOperatorCommissionPct: number;
  updatedBy: string;
}
