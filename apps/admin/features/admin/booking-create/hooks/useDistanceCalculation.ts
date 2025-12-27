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
    // Check if we have both locations
    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      setResult({
        distanceMiles: null,
        durationMinutes: null,
        isCalculating: false,
        error: null,
      });
      return;
    }

    console.log('🗺️ Distance calculation triggered:', { pickupLat, pickupLng, dropoffLat, dropoffLng });

    // Wait for Google Maps to load
    if (typeof window === 'undefined') {
      return undefined;
    }

    const calculateDistance = () => {
      if (!window.google || !window.google.maps || !window.google.maps.DistanceMatrixService) {
        console.log('⏳ Waiting for Google Maps to load...');
        return false;
      }

      console.log('✅ Google Maps loaded, calculating distance...');
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
          console.log('📊 Distance Matrix response:', { status, response });
        if (status === 'OK' && response?.rows[0]?.elements[0]) {
          const element = response.rows[0].elements[0];
          
          if (element.status === 'OK') {
            const distanceMeters = element.distance?.value || 0;
            const durationSeconds = element.duration?.value || 0;
            
            // Convert meters to miles
            const distanceMiles = Math.round((distanceMeters * 0.000621371) * 100) / 100;
            // Convert seconds to minutes
            const durationMinutes = Math.round(durationSeconds / 60);

            console.log('✅ Distance calculated:', { distanceMiles, durationMinutes });
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
      return true;
    };

    // Try to calculate immediately
    if (!calculateDistance()) {
      // If Google Maps not loaded, retry every 500ms for up to 10 seconds
      let retries = 0;
      const maxRetries = 20;
      const interval = setInterval(() => {
        retries++;
        if (calculateDistance()) {
          clearInterval(interval);
        } else if (retries >= maxRetries) {
          console.error('❌ Google Maps failed to load after 10 seconds');
          clearInterval(interval);
          setResult({
            distanceMiles: null,
            durationMinutes: null,
            isCalculating: false,
            error: 'Google Maps failed to load',
          });
        }
      }, 500);
      
      // Cleanup interval on unmount to prevent memory leak
      return () => clearInterval(interval);
    }
    return undefined;
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  return result;
}
