/**
 * Map Default Configuration
 * 
 * Default center, zoom, bounds pentru Mapbox
 * Conform RULES.md: Configurații centralizate
 */

import type { LngLatLike } from 'mapbox-gl';

/**
 * Default Map Center (București, România)
 */
export const DEFAULT_CENTER: LngLatLike = [26.1025, 44.4268]; // [lng, lat] - Mapbox format!

/**
 * Default Zoom Levels
 */
export const DEFAULT_ZOOM = {
  initial: 12,
  min: 8,
  max: 18,
  street: 15,
  city: 12,
  country: 6,
} as const;

/**
 * Map Bounds Padding (pixels)
 */
export const BOUNDS_PADDING = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
} as const;

/**
 * Map Control Positions
 */
export const CONTROL_POSITIONS = {
  navigation: 'top-right',
  scale: 'bottom-left',
  geolocate: 'top-right',
} as const;

/**
 * Animation Durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  flyTo: 1000,
  fitBounds: 800,
  markerUpdate: 300,
} as const;
