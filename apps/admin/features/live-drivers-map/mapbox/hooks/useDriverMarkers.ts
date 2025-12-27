/**
 * useDriverMarkers Hook
 * 
 * React hook pentru driver markers management
 * Conform RULES.md: React hooks pentru UI integration, <150 linii
 */

import type { DriverLocationData } from '@entities/driver-location';
import { useEffect, useRef, useState } from 'react';
import { mapDriverStatus } from '../../utils/markerHelpers';
import { getMarkerColor } from '../config/markerConfig';
import { MapboxManager } from '../core/MapboxManager';
import { AccuracyCircle } from '../features/AccuracyCircle';
import { fitBoundsToDrivers } from '../features/AutoFitBounds';
import { MarkerManager } from '../markers/MarkerManager';

interface UseDriverMarkersOptions {
  mapManager: MapboxManager;
  drivers: DriverLocationData[];
  onDriverClick: (driver: DriverLocationData) => void;
  autoFitBounds?: boolean;
}

interface UseDriverMarkersReturn {
  selectedDriverId: string | null;
  setSelectedDriverId: (id: string | null) => void;
}

/**
 * Hook pentru driver markers management
 */
export function useDriverMarkers({
  mapManager,
  drivers,
  onDriverClick,
  autoFitBounds = true,
}: UseDriverMarkersOptions): UseDriverMarkersReturn {
  const [markerManager] = useState(() => new MarkerManager());
  const [accuracyCircle] = useState(() => new AccuracyCircle());
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Initialize marker manager with map
  useEffect(() => {
    const map = mapManager.getMap();
    if (!map || isInitialized.current) return;

    markerManager.setMap(map);
    accuracyCircle.setMap(map);
    isInitialized.current = true;
  }, [mapManager, markerManager, accuracyCircle]);

  // Set marker click handler
  useEffect(() => {
    markerManager.setOnMarkerClick((driver) => {
      setSelectedDriverId(driver.id);
      onDriverClick(driver);

      // Show accuracy circle
      if (driver.currentLatitude && driver.currentLongitude) {
        const status = mapDriverStatus(driver.onlineStatus, null);
        const color = getMarkerColor(status);
        accuracyCircle.show([driver.currentLongitude, driver.currentLatitude], color);
      }
    });
  }, [markerManager, accuracyCircle, onDriverClick]);

  // Update selected driver ID in marker manager
  useEffect(() => {
    markerManager.setSelectedDriverId(selectedDriverId);
  }, [markerManager, selectedDriverId]);

  // Update markers when drivers change
  useEffect(() => {
    const map = mapManager.getMap();
    if (!map) return;

    const currentMarkers = markerManager.getAllMarkers();
    const driverIds = new Set(drivers.map((d) => d.id));

    // Remove markers for drivers that are no longer in the list
    Array.from(currentMarkers.keys()).forEach((driverId) => {
      if (!driverIds.has(driverId)) {
        markerManager.removeMarker(driverId);
      }
    });

    // Add or update markers for current drivers
    drivers.forEach((driver) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      const existingMarker = markerManager.getMarker(driver.id);

      if (!existingMarker) {
        // Create new marker
        markerManager.createMarker(driver);
      } else {
        // Update existing marker position
        markerManager.updateMarkerPosition(
          driver.id,
          driver.currentLongitude,
          driver.currentLatitude
        );
      }
    });

    // Auto-fit bounds if enabled
    if (autoFitBounds && drivers.length > 0) {
      fitBoundsToDrivers(map, drivers);
    }
  }, [mapManager, markerManager, drivers, autoFitBounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markerManager.clearAll();
      accuracyCircle.hide();
    };
  }, [markerManager, accuracyCircle]);

  return {
    selectedDriverId,
    setSelectedDriverId,
  };
}
