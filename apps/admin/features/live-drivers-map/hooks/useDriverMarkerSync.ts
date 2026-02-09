/**
 * useDriverMarkerSync — Creates, updates, and removes driver markers on the map.
 * Integrates with the predictive animation engine for smooth motion.
 */

'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { getVehicleScale } from '../mapbox/config/markerConfig';
import { createDriverMarkerContainer, updateMarkerColor, updateMarkerRotation } from '../mapbox/markers/markerStyles';
import { getDriverColor, mapDriverStatus } from '../utils/markerHelpers';
import { buildPopupHTML } from '../utils/popupBuilder';
import {
    feedGpsUpdate,
    isDriverRegistered,
    registerDriver,
    unregisterDriver,
} from '../utils/predictiveAnimation';
import { snapToNearestRoad } from '../utils/snapToRoad';


interface RealtimeDriver {
  id: string;
  firstName: string | null;
  lastName: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  onlineStatus: string;
  [key: string]: any;
}

export function useDriverMarkerSync(
  map: React.RefObject<mapboxgl.Map | null>,
  isLoaded: boolean,
  drivers: RealtimeDriver[],
  driversLoading: boolean,
  markerElementsRef: React.MutableRefObject<Map<string, HTMLDivElement>>,
  onSelectDriver: (id: string) => void,
) {
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const lastStatuses = useRef<Map<string, string>>(new Map());
  const hasInitializedBounds = useRef(false);

  useEffect(() => {
    if (!map.current || !isLoaded || driversLoading) return;

    drivers.forEach((driver) => {
      if (!driver.currentLatitude || !driver.currentLongitude) return;

      const rawPos = { lat: driver.currentLatitude, lng: driver.currentLongitude };
      const currentPos = snapToNearestRoad(map.current!, rawPos);

      // Existing driver — feed GPS update to animation engine
      if (isDriverRegistered(driver.id)) {
        const heading = feedGpsUpdate(driver.id, currentPos);
        if (heading !== null) {
          const el = markerElementsRef.current.get(driver.id);
          if (el) updateMarkerRotation(el, heading, true);
        }

        const prevStatus = lastStatuses.current.get(driver.id);
        if (prevStatus !== driver.onlineStatus) {
          const status = mapDriverStatus(driver.onlineStatus, driver.bookingStatus);
          const el = markerElementsRef.current.get(driver.id);
          if (el) updateMarkerColor(el, getDriverColor(status));
          lastStatuses.current.set(driver.id, driver.onlineStatus);
        }
        return;
      }

      if (markers.current.has(driver.id)) return;

      // New driver — create marker
      const driverStatus = mapDriverStatus(driver.onlineStatus, driver.bookingStatus);
      const color = getDriverColor(driverStatus);
      const vehicles = driver.vehicles || [];
      const vehicle = vehicles.find((v: any) => v?.license_plate) || vehicles[0];
      const vehicleScale = getVehicleScale(vehicle?.category);

      const container = createDriverMarkerContainer({
        driverName: `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unknown',
        color,
        rotation: 0,
        vehicleScale,
        licensePlate: vehicle?.license_plate,
      });

      const popupHTML = buildPopupHTML(driver, vehicle, color);

      const marker = new mapboxgl.Marker({ element: container, anchor: 'center' })
        .setLngLat([currentPos.lng, currentPos.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: '320px' }).setHTML(popupHTML))
        .addTo(map.current!);

      container.addEventListener('click', () => onSelectDriver(driver.id));

      markers.current.set(driver.id, marker);
      markerElementsRef.current.set(driver.id, container);
      lastStatuses.current.set(driver.id, driver.onlineStatus);
      registerDriver(driver.id, marker, currentPos);

      // Hide labels if zoomed out
      if (map.current && map.current.getZoom() < 12) {
        const nameEl = container.querySelector('.driver-name') as HTMLElement;
        if (nameEl) nameEl.style.display = 'none';
        const plateEl = container.querySelector('.plate') as HTMLElement;
        if (plateEl) plateEl.style.display = 'none';
      }
    });

    // Remove stale markers
    const driverIds = new Set(drivers.map((d) => d.id));
    markers.current.forEach((marker, id) => {
      if (!driverIds.has(id)) {
        marker.remove();
        markers.current.delete(id);
        markerElementsRef.current.delete(id);
        lastStatuses.current.delete(id);
        unregisterDriver(id);
      }
    });

    // Auto-fit bounds on first load
    if (drivers.length > 0 && !hasInitializedBounds.current && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      drivers.forEach((d) => {
        if (d.currentLatitude && d.currentLongitude) {
          bounds.extend([d.currentLongitude, d.currentLatitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      hasInitializedBounds.current = true;
    }
  }, [isLoaded, drivers, driversLoading]);

  // When map is destroyed (theme change) or unmount — clear everything
  useEffect(() => {
    if (!isLoaded) {
      markers.current.forEach((_, id) => unregisterDriver(id));
      markers.current.clear();
      markerElementsRef.current.clear();
      lastStatuses.current.clear();
      hasInitializedBounds.current = false;
    }
  }, [isLoaded]);

  return { markers };
}
