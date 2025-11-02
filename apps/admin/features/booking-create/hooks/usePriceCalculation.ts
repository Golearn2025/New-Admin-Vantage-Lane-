/**
 * usePriceCalculation Hook
 * Calculates booking price using Backend Pricing API
 */

import { useState, useEffect } from 'react';
import type { BookingFormData } from '../types';

/**
 * Map UI category to backend vehicleType
 */
function mapCategoryToVehicleType(category: string): string {
  const mapping: Record<string, string> = {
    'EXEC': 'executive',
    'LUX': 'luxury',
    'SUV': 'suv',
    'VAN': 'van',
  };
  return mapping[category] || 'executive';
}

/**
 * Map UI tripType to backend bookingType
 */
function mapTripTypeToBookingType(tripType: string): string {
  const mapping: Record<string, string> = {
    'oneway': 'one_way',
    'return': 'return',
    'hourly': 'hourly',
    'fleet': 'fleet',
  };
  return mapping[tripType] || 'one_way';
}

interface PriceDetail {
  component: string;
  amount: number;
  description: string;
}

interface PriceBreakdown {
  baseFare: number;
  distanceFee: number;
  timeFee: number;
  additionalFees: number;
  services: number;
  subtotal: number;
  multipliers: Record<string, number>;
  discounts: number;
  finalPrice: number;
}

interface PricingResult {
  basePrice: number;
  servicesTotal: number;
  total: number;
  breakdown?: PriceBreakdown | undefined;
  details?: PriceDetail[] | undefined;
  isLoading: boolean;
  error: string | null;
}

export function usePriceCalculation(formData: BookingFormData): PricingResult {
  const [pricing, setPricing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only calculate if we have required data
    if (!formData.distanceMiles || !formData.category || !formData.date || !formData.time) {
      return;
    }

    const calculatePrice = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PRICING_URL || 'http://localhost:3001';
        
        const response = await fetch(`${backendUrl}/api/pricing/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickup: formData.pickupText || 'Unknown',
            dropoff: formData.dropoffText || 'Unknown',
            vehicleType: mapCategoryToVehicleType(formData.category),
            bookingType: mapTripTypeToBookingType(formData.tripType),
            dateTime: `${formData.date}T${formData.time}:00Z`,
            distance: (formData.distanceMiles || 0) * 1.60934, // miles → km
            duration: formData.durationMinutes || 0,
            extras: formData.services
              .filter(s => s.selected)
              .map(s => s.code),
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setPricing(result);
        } else {
          throw new Error(result.error || 'Price calculation failed');
        }
      } catch (err) {
        console.error('Price calculation error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    calculatePrice();
  }, [
    formData.tripType,
    formData.category,
    formData.distanceMiles,
    formData.durationMinutes,
    formData.date,
    formData.time,
    formData.pickupText,
    formData.dropoffText,
    formData.services,
  ]);

  return {
    // Use subtotal (all fees WITHOUT services) instead of just baseFare
    basePrice: pricing?.breakdown?.subtotal || 0,
    servicesTotal: pricing?.breakdown?.services || 0,
    total: pricing?.finalPrice || 0,
    breakdown: pricing?.breakdown,
    details: pricing?.details,
    isLoading,
    error,
  };
}
