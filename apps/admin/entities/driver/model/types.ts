/**
 * Driver Entity - Type Definitions
 * 
 * Updated for Priority 1+2 migrations:
 * - Driver status lifecycle
 * - Document replacement tracking
 * - Vehicle service types
 */

/**
 * Driver Status - Lifecycle states
 */
export type DriverStatus = 
  | 'pending_documents'  // Waiting for document uploads
  | 'pending_approval'   // Documents uploaded, awaiting admin review
  | 'active'             // Approved and can accept bookings
  | 'inactive'           // Deactivated (expired docs, admin action)
  | 'suspended';         // Temporarily suspended

/**
 * Document Status - Including replacement tracking
 */
export type DocumentStatus = 
  | 'pending'        // Awaiting review
  | 'approved'       // Approved by admin
  | 'rejected'       // Rejected by admin
  | 'expired'        // Past expiry date
  | 'expiring_soon'  // Expiring within 30 days
  | 'replaced';      // Replaced by newer version

/**
 * Vehicle Service Type - Booking categories this vehicle can accept
 */
export type VehicleServiceType = 'exec' | 'lux' | 'suv' | 'van';

/**
 * Driver data from database (camelCase for app use)
 */
export interface DriverData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Raw driver data from Supabase (snake_case)
 */
export interface DriverRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateDriverPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateDriverPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

/**
 * Extended driver profile data with organization, vehicle, and documents info
 */
export interface DriverProfileData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  profilePhotoUrl: string | null; // Replaces profileImageUrl (migration cleanup)
  // License info moved to driver_documents table (see DocumentData)
  pcoLicenseNumber: string | null;
  pcoLicenseExpiry: string | null;
  ratingAverage: number;
  ratingCount: number;
  
  // Legacy fields (deprecated but kept for backward compatibility)
  isActive: boolean;
  isApproved: boolean;
  
  // New status management (Priority 1)
  status: DriverStatus;
  activatedAt: string | null;
  deactivatedAt: string | null;
  deactivationReason: string | null;
  
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  organizationId: string | null;
  organizationName: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Driver document data
 */
export interface DocumentData {
  id: string;
  driverId: string;
  documentType: string;
  documentCategory: string;
  fileUrl: string | null;
  fileName: string | null;
  uploadDate: string;
  expiryDate: string | null;
  status: DocumentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  
  // Document replacement tracking (Priority 1)
  replacesDocumentId: string | null;
  replacementReason: string | null;
}

/**
 * Vehicle data associated with driver
 */
export interface VehicleData {
  id: string;
  organizationId: string;
  driverId: string | null;
  category: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string;
  insuranceExpiry: string;
  motExpiry: string | null;
  passengerCapacity: number | null;
  luggageCapacity: number | null;
  isActive: boolean;
  isAvailable: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vehicle Service Type Assignment
 * Links vehicle to booking service types (Priority 2)
 */
export interface VehicleServiceTypeData {
  id: string;
  vehicleId: string;
  serviceType: VehicleServiceType;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}
