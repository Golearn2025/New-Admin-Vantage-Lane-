/**
 * Vehicle Models by Category
 * Based on landing page vehicle data
 */

import type { VehicleCategory } from '../types';

export interface VehicleModel {
  value: string;
  label: string;
}

export const VEHICLE_MODELS: Record<VehicleCategory, VehicleModel[]> = {
  EXEC: [
    { value: 'exec_e_class', label: 'Mercedes E-Class or similar' },
    { value: 'exec_5_series', label: 'BMW 5 Series or similar' },
  ],
  LUX: [
    { value: 'lux_s_class', label: 'Mercedes S-Class or similar' },
    { value: 'lux_7_series', label: 'BMW 7 Series or similar' },
  ],
  VAN: [
    { value: 'van_v_class', label: 'Mercedes V-Class or similar' },
  ],
  SUV: [
    { value: 'suv_range_rover', label: 'Range Rover or similar' },
  ],
};
