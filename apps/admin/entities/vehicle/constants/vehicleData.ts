/**
 * Vehicle Data Constants
 * Platform-approved makes, models, colors, and years
 */

export const VEHICLE_YEARS = [2022, 2023, 2024, 2025, 2026];

export const VEHICLE_COLORS: Array<{ value: string; label: string }> = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'silver', label: 'Silver' },
  { value: 'grey', label: 'Grey' },
  { value: 'blue', label: 'Blue' },
];

export const VEHICLE_MAKES: Array<{ value: string; label: string }> = [
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'range-rover', label: 'Range Rover' },
];

// Model mapping based on make and category
export const VEHICLE_MODELS = {
  bmw: {
    executive: [{ value: '5-series', label: '5 Series' }],
    luxury: [{ value: '7-series', label: '7 Series' }],
  },
  mercedes: {
    executive: [{ value: 'e-class', label: 'E-Class' }],
    luxury: [{ value: 's-class', label: 'S-Class' }],
    van: [{ value: 'v-class', label: 'V-Class' }],
  },
  'range-rover': {
    suv: [
      { value: 'sport', label: 'Range Rover Sport' },
      { value: 'evoque', label: 'Range Rover Evoque' },
      { value: 'velar', label: 'Range Rover Velar' },
    ],
  },
};

// Get models for a specific make (all categories)
export function getModelsForMake(make: string): Array<{ value: string; label: string }> {
  const makeKey = make.toLowerCase() as keyof typeof VEHICLE_MODELS;
  const makeModels = VEHICLE_MODELS[makeKey];
  
  if (!makeModels) return [];
  
  // Flatten all models from all categories
  return Object.values(makeModels).flat() as Array<{ value: string; label: string }>;
}

// Get suggested category based on make and model
export function getSuggestedCategory(make: string, model: string): string | null {
  const makeKey = make.toLowerCase() as keyof typeof VEHICLE_MODELS;
  const makeModels = VEHICLE_MODELS[makeKey];
  
  if (!makeModels) return null;
  
  for (const [category, models] of Object.entries(makeModels)) {
    if (models.some((m: { value: string; label: string }) => m.value === model.toLowerCase())) {
      return category;
    }
  }
  
  return null;
}
