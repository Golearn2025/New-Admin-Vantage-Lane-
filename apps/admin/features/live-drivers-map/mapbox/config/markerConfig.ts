/**
 * Marker Configuration
 * 
 * Culori, scale, și configurații pentru driver markers
 * Conform RULES.md: Configurații centralizate, ușor de modificat
 */

import type { DriverStatus } from '../../utils/markerHelpers';

/**
 * Marker Colors by Driver Status
 * Conform design system - vezi StatusBadge colors
 */
export const MARKER_COLORS = {
  ONLINE: '#22C55E',      // Light green - driver available
  EN_ROUTE: '#3B82F6',    // Blue - going to pickup
  ARRIVED: '#7C3AED',     // Violet - arrived at pickup
  IN_PROGRESS: '#D4AF37', // Gold - ride in progress
  OFFLINE: '#9CA3AF',     // Gray - offline/unavailable
} as const;

/**
 * Marker Scale Values
 */
export const MARKER_SCALES = {
  normal: 1.0,
  selected: 1.3,
  hover: 1.1,
} as const;

/**
 * Vehicle Type Scale Multipliers
 * Un singur SVG, diferențiat doar prin scale
 */
export const SCALE_BY_TYPE = {
  exec: 1,
  lux: 1.1,
  suv: 1.25,
  van: 1.45,
} as const;

export type VehicleType = keyof typeof SCALE_BY_TYPE;

/**
 * Get vehicle scale multiplier
 */
export function getVehicleScale(type?: string): number {
  if (!type) return SCALE_BY_TYPE.exec;
  const normalized = type.toLowerCase() as VehicleType;
  return SCALE_BY_TYPE[normalized] ?? SCALE_BY_TYPE.exec;
}

/**
 * Marker Z-Index Values
 */
export const MARKER_Z_INDEX = {
  normal: 1000,
  selected: 2000,
  hover: 1500,
} as const;

/**
 * Accuracy Circle Configuration
 */
export const ACCURACY_CIRCLE = {
  radius: 50, // meters
  strokeWeight: 2,
  strokeOpacity: 0.3,
  fillOpacity: 0.12,
} as const;

/**
 * Get marker color for driver status
 */
export function getMarkerColor(status: DriverStatus): string {
  if (status.main === 'ONLINE') {
    return MARKER_COLORS.ONLINE;
  }
  
  if (status.main === 'BUSY' && status.sub) {
    switch (status.sub) {
      case 'EN_ROUTE':
        return MARKER_COLORS.EN_ROUTE;
      case 'ARRIVED':
        return MARKER_COLORS.ARRIVED;
      case 'IN_PROGRESS':
        return MARKER_COLORS.IN_PROGRESS;
      default:
        return MARKER_COLORS.ONLINE;
    }
  }
  
  return MARKER_COLORS.OFFLINE;
}

/**
 * Get marker scale based on state
 */
export function getMarkerScale(isSelected: boolean, isHovered: boolean = false): number {
  if (isSelected) return MARKER_SCALES.selected;
  if (isHovered) return MARKER_SCALES.hover;
  return MARKER_SCALES.normal;
}

/**
 * Get marker z-index based on state
 */
export function getMarkerZIndex(isSelected: boolean, isHovered: boolean = false): number {
  if (isSelected) return MARKER_Z_INDEX.selected;
  if (isHovered) return MARKER_Z_INDEX.hover;
  return MARKER_Z_INDEX.normal;
}
