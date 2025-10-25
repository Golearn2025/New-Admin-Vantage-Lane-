/**
 * usePriceCalculation Hook
 * Calculates booking price in real-time
 */

import { useMemo } from 'react';
import type { BookingFormData } from '../types';

const BASE_PRICES = {
  EXEC: 85,
  LUX: 150,
  SUV: 120,
  VAN: 140,
};

const HOURLY_RATES = {
  EXEC: 45,
  LUX: 75,
  SUV: 60,
  VAN: 65,
};

export function usePriceCalculation(formData: BookingFormData) {
  const basePrice = useMemo(() => {
    if (formData.tripType === 'hourly') {
      const rate = HOURLY_RATES[formData.category];
      return rate * (formData.hours || 1);
    }

    if (formData.tripType === 'return') {
      return BASE_PRICES[formData.category] * 2;
    }

    if (formData.tripType === 'fleet') {
      let total = 0;
      if (formData.fleetExecutive) total += BASE_PRICES.EXEC * formData.fleetExecutive;
      if (formData.fleetSClass) total += BASE_PRICES.LUX * formData.fleetSClass;
      if (formData.fleetVClass) total += BASE_PRICES.VAN * formData.fleetVClass;
      if (formData.fleetSUV) total += BASE_PRICES.SUV * formData.fleetSUV;
      return total;
    }

    return BASE_PRICES[formData.category];
  }, [formData.tripType, formData.category, formData.hours, formData.fleetExecutive, formData.fleetSClass, formData.fleetVClass, formData.fleetSUV]);

  const servicesTotal = useMemo(() => {
    return formData.services
      .filter(s => s.selected)
      .reduce((sum, s) => sum + (s.price || 0), 0);
  }, [formData.services]);

  const total = basePrice + servicesTotal;

  return {
    basePrice,
    servicesTotal,
    total,
  };
}
