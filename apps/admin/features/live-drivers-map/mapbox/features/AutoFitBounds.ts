/**
 * Auto Fit Bounds Feature
 * 
 * Auto-zoom la toți drivers pe hartă
 * Conform RULES.md: Feature separate, <50 linii
 */

import type { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { BOUNDS_PADDING, DEFAULT_ZOOM } from '../config/mapDefaults';

/**
 * Fit map bounds to show all coordinates
 */
export function fitBoundsToCoordinates(
  map: MapboxMap,
  coordinates: LngLatLike[]
): void {
  if (coordinates.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();
  coordinates.forEach((coord) => bounds.extend(coord));

  map.fitBounds(bounds, {
    padding: BOUNDS_PADDING,
    maxZoom: DEFAULT_ZOOM.street,
    duration: 800,
  });
}

/**
 * Fit map bounds to show all drivers
 */
export function fitBoundsToDrivers(
  map: MapboxMap,
  drivers: Array<{ currentLatitude?: number | null; currentLongitude?: number | null }>
): void {
  const coordinates: LngLatLike[] = drivers
    .filter((d) => d.currentLatitude != null && d.currentLongitude != null)
    .map((d) => [d.currentLongitude!, d.currentLatitude!]);

  fitBoundsToCoordinates(map, coordinates);
}
