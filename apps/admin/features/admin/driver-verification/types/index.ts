/**
 * Driver Verification - Type Definitions
 * Used by driver verification feature
 */

import type { DocumentStatus, DriverStatus } from '@entities/driver';

/**
 * Document types for driver verification
 */
export type DriverDocType = 
  | 'license'
  | 'insurance' 
  | 'registration'
  | 'mot'
  | 'pco'
  | 'photo'
  | 'vehicle_insurance'
  | 'vehicle_registration';

/**
 * Document data for verification UI
 */
export interface DriverDoc {
  id: string;
  type: DriverDocType;
  url: string;
  verified: boolean;
  status?: DocumentStatus;
  uploadedAt: string;
  expiryDate?: string | null;
  rejectionReason?: string | null;
}

/**
 * Vehicle data for verification
 */
export interface DriverVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  category: string;
}

/**
 * Complete driver verification data
 */
export interface DriverVerificationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  documents: DriverDoc[];
  vehicleCategory: string[];
  status: DriverStatus | 'pending' | 'verified' | 'rejected';
  operatorId: string | null;
  createdAt: string;
  
  // Vehicle info (needed for service type assignment)
  vehicleId?: string | undefined;
  vehicle?: DriverVehicle | undefined;
}
