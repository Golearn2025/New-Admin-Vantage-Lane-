/**
 * AssignmentSection Types
 * 
 * Shared types for assignment section components.
 * Extracted to prevent circular dependencies.
 */

export interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalTrips: number;
  currentDistance?: number; // miles from pickup
  licenseNumber?: string;
  memberSince?: string;
  languages?: string[];
  certifications?: string[];
}

export interface VehicleDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  luggageCapacity: number;
  lastServiceDate?: string;
}
