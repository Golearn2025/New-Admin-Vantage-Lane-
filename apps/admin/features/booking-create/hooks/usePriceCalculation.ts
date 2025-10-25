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

const PRICE_PER_MILE = {
  EXEC: 2.5,   // £2.50 per mile
  LUX: 4.0,    // £4.00 per mile
  SUV: 3.5,    // £3.50 per mile
  VAN: 3.0,    // £3.00 per mile
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
      // Return: Base price + distance-based price (round trip)
      const base = BASE_PRICES[formData.category];
      if (formData.distanceMiles) {
        const distancePrice = PRICE_PER_MILE[formData.category] * formData.distanceMiles * 2; // x2 for return
        return base + distancePrice;
      }
      return base * 2;
    }

    if (formData.tripType === 'fleet') {
      let total = 0;
      if (formData.fleetExecutive) total += BASE_PRICES.EXEC * formData.fleetExecutive;
      if (formData.fleetSClass) total += BASE_PRICES.LUX * formData.fleetSClass;
      if (formData.fleetVClass) total += BASE_PRICES.VAN * formData.fleetVClass;
      if (formData.fleetSUV) total += BASE_PRICES.SUV * formData.fleetSUV;
      return total;
    }

    // Oneway: Base price + distance-based price
    const base = BASE_PRICES[formData.category];
    if (formData.distanceMiles) {
      const distancePrice = PRICE_PER_MILE[formData.category] * formData.distanceMiles;
      return base + distancePrice;
    }
    return base;
  }, [formData.tripType, formData.category, formData.hours, formData.distanceMiles, formData.fleetExecutive, formData.fleetSClass, formData.fleetVClass, formData.fleetSUV]);

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
