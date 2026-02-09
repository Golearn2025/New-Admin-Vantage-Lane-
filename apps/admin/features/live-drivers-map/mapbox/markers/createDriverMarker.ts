/**
 * Create Driver Marker - Factory Function
 * 
 * Factory pentru crearea driver markers cu Mapbox standard API
 * Conform RULES.md: Factory pattern, <100 linii
 */

import type { DriverLocationData } from '@entities/driver-location';
import mapboxgl, { type Marker } from 'mapbox-gl';
import { getStatusLabel, mapDriverStatus } from '../../utils/markerHelpers';
import { getMarkerColor, getMarkerScale } from '../config/markerConfig';
import { createPremiumCarMarker } from './markerStyles';

/**
 * Create driver marker with Mapbox standard API
 */
export function createDriverMarker(
  driver: DriverLocationData,
  isSelected: boolean = false,
  onClick?: (driver: DriverLocationData) => void
): Marker | null {
  if (!driver.currentLatitude || !driver.currentLongitude) {
    return null;
  }

  // Map driver status
  const status = mapDriverStatus(driver.onlineStatus, null);
  const color = getMarkerColor(status);
  const scale = getMarkerScale(isSelected);

  // Create premium car marker element
  const el = createPremiumCarMarker(color, 0, scale);

  // Add driver info as data attributes
  el.dataset.driverId = driver.id;
  el.dataset.driverName = `${driver.firstName || ''} ${driver.lastName || ''}`.trim();
  el.dataset.status = getStatusLabel(status);

  // Create Mapbox marker
  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'center',
  });

  // Add click handler
  if (onClick) {
    el.addEventListener('click', () => {
      onClick(driver);
    });
  }

  // Add popup with driver info
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false,
  }).setHTML(`
    <div style="padding: 8px; min-width: 150px;">
      <h3 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: ${color};">
        🚗 ${driver.firstName || ''} ${driver.lastName || ''}
      </h3>
      <p style="margin: 0; font-size: 11px; color: #64748B;">
        Status: <span style="color: ${color}; font-weight: 600;">${getStatusLabel(status)}</span>
      </p>
    </div>
  `);

  marker.setPopup(popup);

  // Show popup on hover
  el.addEventListener('mouseenter', () => {
    marker.togglePopup();
  });

  el.addEventListener('mouseleave', () => {
    marker.togglePopup();
  });

  return marker;
}
