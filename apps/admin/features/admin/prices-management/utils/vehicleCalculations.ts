/**
 * Vehicle Calculations Utilities
 * 
 * Business logic for vehicle type pricing calculations - focused on calculation logic
 */

import type { VehicleTypeRates } from '@entities/pricing';

export interface CalculationExample {
  baseFare: number;
  distanceFee: number;
  timeFee: number;
  total: number;
}

export interface CommissionBreakdown {
  customerPrice: number;
  platformFee: number;
  operatorNet: number;
  operatorCommissionAmount: number;
  driverPayout: number;
}

/**
 * Calculate fare breakdown for a given distance and duration
 */
export function calculateExample(rates: VehicleTypeRates): CalculationExample {
  const distance = 15.5; // miles
  const duration = 45; // minutes
  const first6 = Math.min(distance, 6) * rates.per_mile_first_6;
  const remaining = Math.max(distance - 6, 0) * rates.per_mile_after_6;
  const distanceFee = first6 + remaining;
  const timeFee = duration * rates.per_minute;
  const total = rates.base_fare + distanceFee + timeFee;

  return {
    baseFare: rates.base_fare,
    distanceFee,
    timeFee,
    total: Math.max(total, rates.minimum_fare),
  };
}

/**
 * Calculate commission breakdown for all parties
 */
export function calculateCommissionBreakdown(customerPrice: number): CommissionBreakdown {
  const platformCommission = 0.10; // 10%
  const operatorCommission = 0.20; // 20%
  
  const platformFee = customerPrice * platformCommission;
  const operatorNet = customerPrice - platformFee;
  const operatorCommissionAmount = operatorNet * operatorCommission;
  const driverPayout = operatorNet - operatorCommissionAmount;
  
  return {
    customerPrice,
    platformFee,
    operatorNet,
    operatorCommissionAmount,
    driverPayout,
  };
}
