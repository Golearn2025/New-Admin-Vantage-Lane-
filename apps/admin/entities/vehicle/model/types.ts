/**
 * Vehicle Entity - Type Definitions
 * 
 * Driver submits: plate, make, model, year, color + documents
 * Admin approves: sets category based on verification
 */

import type { VehicleCategory, VehicleStatus, VehicleYear, VehicleColor } from './constants';

/**
 * Vehicle record from database
 */
export interface Vehicle {
  id: string;
  driver_id: string;
  license_plate: string;
  make: string;
  model: string;
  year: VehicleYear;
  color: VehicleColor;
  
  // Set by admin on approval
  category?: VehicleCategory;
  
  // Workflow
  status: VehicleStatus;
  rejection_reason?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string; // Admin user ID
}

/**
 * Form data for driver adding new vehicle
 * NO category field - driver cannot choose!
 */
export interface AddVehicleFormData {
  license_plate: string;
  make: string;
  model: string;
  year: VehicleYear;
  color: VehicleColor;
}

/**
 * Admin approval data
 * Admin sets category based on documents verification
 */
export interface ApproveVehicleData {
  vehicle_id: string;
  category: VehicleCategory;
  admin_id: string;
}

/**
 * Admin rejection data
 */
export interface RejectVehicleData {
  vehicle_id: string;
  rejection_reason: string;
  admin_id: string;
}

/**
 * Vehicle with driver info (for admin lists)
 */
export interface VehicleWithDriver extends Vehicle {
  driver: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}
