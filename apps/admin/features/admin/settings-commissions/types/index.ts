/**
 * Settings Commissions Types
 */

export interface CommissionSettings {
  platformCommissionPercent: number;
  operatorCommissionPercent: number;
}

export interface OperatorCommission {
  operatorId: string;
  operatorName: string;
  commissionPercent: number;
}
