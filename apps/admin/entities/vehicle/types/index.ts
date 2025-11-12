/**
 * Vehicle Entity Types
 * Zero any types - TypeScript strict mode
 */

export type VehicleApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Vehicle {
  id: string;
  organizationId: string;
  driverId: string | null;
  category: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string;
  passengerCapacity: number | null;
  luggageCapacity: number | null;
  insuranceExpiry: string;
  motExpiry: string | null;
  isActive: boolean;
  isAvailable: boolean;
  approvalStatus: VehicleApprovalStatus;
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
}

export interface VehicleApprovalData {
  category: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
  approvalStatus: VehicleApprovalStatus;
  rejectionReason?: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description: string | null;
  priceMultiplier: number;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export interface DriverJobType {
  id: string;
  driverId: string;
  jobCategoryId: string;
  categoryName: string;
  categoryDescription: string | null;
  isAllowed: boolean;
  configuredAt: string;
}
