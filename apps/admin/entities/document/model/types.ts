/**
 * Document Entity - Types
 * Premium types for driver/vehicle documents
 *
 * MODERN & PREMIUM 100% Design Tokens
 */

export type DocumentStatus =
  | 'pending' // Waiting for admin approval
  | 'approved' // Approved by admin
  | 'rejected' // Rejected by admin
  | 'expired' // Document expired
  | 'expiring_soon'; // Expires in < 30 days

export type DriverDocumentType =
  | 'driving_licence'
  | 'electronic_counterpart'
  | 'pco_licence'
  | 'bank_statement'
  | 'profile_photo'
  | 'proof_of_identity';

export type VehicleDocumentType =
  | 'phv_licence'
  | 'mot_certificate'
  | 'insurance_certificate'
  | 'v5c_logbook'
  | 'hire_agreement'
  | 'vehicle_schedule'
  | 'driver_schedule';

export type DocumentType = DriverDocumentType | VehicleDocumentType;

export type DocumentCategory = 'driver' | 'vehicle' | 'operator';

export interface Document {
  id: string;
  type: DocumentType;
  category: DocumentCategory;
  userId: string; // driver_id or operator_id
  userType: 'driver' | 'operator';
  userName: string; // For display in table
  userEmail: string;

  // Document info
  name: string;
  description: string;
  fileUrl?: string;
  thumbnailUrl?: string;

  // Status
  status: DocumentStatus;
  uploadDate: string;
  expiryDate?: string;

  // Approval
  approvedBy?: string; // admin_id
  approvedAt?: string;
  rejectedBy?: string; // admin_id
  rejectedAt?: string;
  rejectionReason?: string;

  // Metadata
  isRequired: boolean;
  hasExpiryDate: boolean;
  fileSize?: number;
  mimeType?: string;

  createdAt: string;
  updatedAt: string;
}

export interface DocumentListFilters {
  status?: DocumentStatus;
  type?: DocumentType;
  category?: DocumentCategory;
  userType?: 'driver' | 'operator';
  userId?: string;
  organizationId?: string; // ✅ RBAC: Filter by operator organization
  expiringInDays?: number; // e.g., 30 for expiring soon
  search?: string; // Search by user name or email
}

export interface DocumentApprovalData {
  documentId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface BulkApprovalData {
  documentIds: string[];
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}
