/**
 * Driver Document Zod Schemas
 * 
 * Validation schemas for document data.
 */

import { z } from 'zod';

/**
 * Document status enum
 */
export const documentStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'expired',
  'expiring_soon',
]);

/**
 * Document type schemas
 */
export const driverDocumentTypeSchema = z.enum([
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'bank_statement',
  'profile_photo',
  'proof_of_identity',
]);

export const vehicleDocumentTypeSchema = z.enum([
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
  'hire_agreement',
  'vehicle_schedule',
  'driver_schedule',
]);

export const documentTypeSchema = z.union([
  driverDocumentTypeSchema,
  vehicleDocumentTypeSchema,
]);

/**
 * Document category
 */
export const documentCategorySchema = z.enum(['driver', 'vehicle']);

/**
 * Complete driver document schema
 */
export const driverDocumentSchema = z.object({
  id: z.string().uuid(),
  driver_id: z.string().uuid(),
  document_type: documentTypeSchema,
  document_category: documentCategorySchema,
  
  // File info
  file_url: z.string().url().nullable(),
  file_name: z.string().nullable(),
  file_size: z.number().int().positive().nullable(),
  mime_type: z.string().nullable(),
  
  // Dates
  upload_date: z.string().datetime(),
  expiry_date: z.string().nullable(),
  expiry_notified_at: z.string().datetime().nullable(),
  
  // Status & approval
  status: documentStatusSchema,
  reviewed_by: z.string().uuid().nullable(),
  reviewed_at: z.string().datetime().nullable(),
  rejection_reason: z.string().nullable(),
  
  // Metadata
  notes: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  
  // Audit
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Document upload payload schema
 */
export const documentUploadPayloadSchema = z.object({
  document_type: documentTypeSchema,
  file: z.instanceof(File),
  expiry_date: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Document update payload schema
 */
export const documentUpdatePayloadSchema = z.object({
  expiry_date: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: documentStatusSchema.optional(),
});

/**
 * Validate document upload payload
 */
export function validateDocumentUpload(data: unknown) {
  return documentUploadPayloadSchema.parse(data);
}

/**
 * Validate document update payload
 */
export function validateDocumentUpdate(data: unknown) {
  return documentUpdatePayloadSchema.parse(data);
}
