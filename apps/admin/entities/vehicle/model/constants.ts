/**
 * Vehicle Entity - Constants
 * Predefined options for vehicle make, model, year, and color
 * 
 * ADMIN CONTROLLED - Only these options allowed
 * Category is set by admin AFTER approval, not by driver
 */

export type VehicleCategory = 'executive' | 'luxury' | 'van' | 'suv';

export interface VehicleOption {
  make: string;
  model: string;
  category: VehicleCategory; // Internal - used by admin
}

/**
 * Allowed vehicle make/model combinations
 * Each vehicle maps to a category (set by admin on approval)
 */
export const VEHICLE_OPTIONS: VehicleOption[] = [
  // Executive
  { make: 'Mercedes-Benz', model: 'E-Class', category: 'executive' },
  { make: 'BMW', model: '5 Series', category: 'executive' },
  
  // Luxury
  { make: 'Mercedes-Benz', model: 'S-Class', category: 'luxury' },
  { make: 'BMW', model: '7 Series', category: 'luxury' },
  
  // Van
  { make: 'Mercedes-Benz', model: 'V-Class', category: 'van' },
  
  // SUV
  { make: 'Land Rover', model: 'Range Rover', category: 'suv' },
];

/**
 * Allowed vehicle years (2022-2026)
 */
export const VEHICLE_YEARS = [2022, 2023, 2024, 2025, 2026] as const;
export type VehicleYear = typeof VEHICLE_YEARS[number];

/**
 * Most common vehicle colors
 */
export const VEHICLE_COLORS = [
  'Black',
  'White',
  'Silver',
  'Grey',
  'Blue',
  'Red',
  'Green',
  'Brown',
  'Beige',
  'Orange',
] as const;
export type VehicleColor = typeof VEHICLE_COLORS[number];

/**
 * Vehicle status workflow
 */
export const VEHICLE_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;
export type VehicleStatus = typeof VEHICLE_STATUS[keyof typeof VEHICLE_STATUS];

/**
 * Get category for a make/model combination
 * Used by admin to auto-suggest category based on vehicle
 */
export function getVehicleCategory(make: string, model: string): VehicleCategory | null {
  const vehicle = VEHICLE_OPTIONS.find(
    (v) => v.make === make && v.model === model
  );
  return vehicle?.category || null;
}

/**
 * Get all makes (unique)
 */
export function getVehicleMakes(): string[] {
  return Array.from(new Set(VEHICLE_OPTIONS.map((v) => v.make)));
}

/**
 * Get models for a specific make
 */
export function getModelsForMake(make: string): string[] {
  return VEHICLE_OPTIONS
    .filter((v) => v.make === make)
    .map((v) => v.model);
}

/**
 * Validate if make/model combination is allowed
 */
export function isValidVehicle(make: string, model: string): boolean {
  return VEHICLE_OPTIONS.some(
    (v) => v.make === make && v.model === model
  );
}
