/**
 * Vehicle Form Options
 * Centralized constants for vehicle categories and years
 */

export const VEHICLE_CATEGORIES = [
  { value: 'executive', label: 'Executive' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'business', label: 'Business' },
  { value: 'eco', label: 'Eco' },
];

const CURRENT_YEAR = new Date().getFullYear();

export const VEHICLE_YEARS = Array.from({ length: 25 }, (_, i) => ({
  value: (CURRENT_YEAR - i).toString(),
  label: (CURRENT_YEAR - i).toString(),
}));

export const DEFAULT_VEHICLE_YEAR = CURRENT_YEAR;
