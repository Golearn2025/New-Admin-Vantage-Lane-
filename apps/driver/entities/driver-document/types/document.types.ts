/**
 * Driver Document Types
 * 
 * Type definitions for driver document management system.
 * Matches DB schema: driver_documents table.
 */

/**
 * Document status enum
 */
export type DocumentStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'expiring_soon';

/**
 * Driver document types (matches App Driver 2025)
 */
export type DriverDocumentType =
  | 'driving_licence'
  | 'electronic_counterpart'
  | 'pco_licence'
  | 'bank_statement'
  | 'profile_photo'
  | 'proof_of_identity';

/**
 * Vehicle document types
 */
export type VehicleDocumentType =
  | 'phv_licence'
  | 'mot_certificate'
  | 'insurance_certificate'
  | 'v5c_logbook'
  | 'hire_agreement'
  | 'vehicle_schedule'
  | 'driver_schedule';

/**
 * All document types
 */
export type DocumentType = DriverDocumentType | VehicleDocumentType;

/**
 * Document category
 */
export type DocumentCategory = 'driver' | 'vehicle';

/**
 * Complete driver document interface (matches DB schema)
 */
export interface DriverDocument {
  id: string;
  driver_id: string;
  document_type: DocumentType;
  document_category: DocumentCategory;
  
  // File info
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  
  // Dates
  upload_date: string;
  expiry_date: string | null;
  expiry_notified_at: string | null;
  
  // Status & approval
  status: DocumentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  
  // Metadata
  notes: string | null;
  metadata: Record<string, unknown> | null;
  
  // Audit
  created_at: string;
  updated_at: string;
}

/**
 * Document upload payload
 */
export interface DocumentUploadPayload {
  document_type: DocumentType;
  file: File;
  expiry_date?: string;
  notes?: string;
}

/**
 * Document update payload
 */
export interface DocumentUpdatePayload {
  expiry_date?: string | null;
  notes?: string | null;
  status?: DocumentStatus;
}

/**
 * Document with expiry info helper
 */
export interface DocumentWithExpiry extends DriverDocument {
  days_until_expiry: number | null;
  is_expired: boolean;
  is_expiring_soon: boolean;
}

/**
 * Document type metadata
 */
export interface DocumentTypeMetadata {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  has_expiry: boolean;
  icon: string;
  accept: string; // MIME types for file input
  max_size_mb: number;
}
