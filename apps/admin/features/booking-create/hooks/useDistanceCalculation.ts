/**
 * useDistanceCalculation Hook
 * Calculates distance and duration using Google Distance Matrix API
 */

import { useEffect, useState } from 'react';

interface DistanceResult {
  distanceMiles: number | null;
  durationMinutes: number | null;
  isCalculating: boolean;
  error: string | null;
}

export function useDistanceCalculation(
  pickupLat?: number,
  pickupLng?: number,
  dropoffLat?: number,
  dropoffLng?: number
): DistanceResult {
  const [result, setResult] = useState<DistanceResult>({
    distanceMiles: null,
    durationMinutes: null,
    isCalculating: false,
    error: null,
  });

  useEffect(() => {
    // Check if we have both locations and Google Maps is loaded
    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      setResult({
        distanceMiles: null,
        durationMinutes: null,
        isCalculating: false,
        error: null,
      });
      return;
    }

    if (typeof window === 'undefined' || !window.google) {
      return;
    }

    setResult((prev) => ({ ...prev, isCalculating: true, error: null }));

    const service = new google.maps.DistanceMatrixService();
    const origin = new google.maps.LatLng(pickupLat, pickupLng);
    const destination = new google.maps.LatLng(dropoffLat, dropoffLng);

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL, // Miles
      },
      (response, status) => {
        if (status === 'OK' && response?.rows[0]?.elements[0]) {
          const element = response.rows[0].elements[0];
          
          if (element.status === 'OK') {
            const distanceMeters = element.distance?.value || 0;
            const durationSeconds = element.duration?.value || 0;
            
            // Convert meters to miles
            const distanceMiles = Math.round((distanceMeters * 0.000621371) * 100) / 100;
            // Convert seconds to minutes
            const durationMinutes = Math.round(durationSeconds / 60);

            setResult({
              distanceMiles,
              durationMinutes,
              isCalculating: false,
              error: null,
            });
          } else {
            setResult({
              distanceMiles: null,
              durationMinutes: null,
              isCalculating: false,
              error: 'Could not calculate distance',
            });
          }
        } else {
          setResult({
            distanceMiles: null,
            durationMinutes: null,
            isCalculating: false,
            error: `Distance calculation failed: ${status}`,
          });
        }
      }
    );
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  return result;
}
