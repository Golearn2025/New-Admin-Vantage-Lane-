/**
 * Vehicle Categories Settings Types
 */

export type VehicleCategoryType = 'EXEC' | 'LUX' | 'VAN' | 'SUV';

export interface VehicleCategory {
  id: string;
  code: VehicleCategoryType;
  name: string;
  description: string;
  priceMultiplier: number;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface VehicleCategoryFormData {
  code: VehicleCategoryType;
  name: string;
  description: string;
  priceMultiplier: number;
  isActive: boolean;
}
