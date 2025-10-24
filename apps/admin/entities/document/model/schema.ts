/**
 * Document Entity - Zod Schemas
 * Validation schemas for documents
 * 
 * MODERN & PREMIUM - Type-safe validation
 */

import { z } from 'zod';

export const DocumentStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'expired',
  'expiring_soon',
]);

export const DriverDocumentTypeSchema = z.enum([
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'bank_statement',
  'profile_photo',
  'proof_of_identity',
]);

export const VehicleDocumentTypeSchema = z.enum([
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
  'hire_agreement',
  'vehicle_schedule',
  'driver_schedule',
]);

export const DocumentTypeSchema = z.union([
  DriverDocumentTypeSchema,
  VehicleDocumentTypeSchema,
]);

export const DocumentCategorySchema = z.enum(['driver', 'vehicle', 'operator']);

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  type: DocumentTypeSchema,
  category: DocumentCategorySchema,
  userId: z.string().uuid(),
  userType: z.enum(['driver', 'operator']),
  userName: z.string().min(1),
  userEmail: z.string().email(),
  
  name: z.string().min(1),
  description: z.string(),
  fileUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  
  status: DocumentStatusSchema,
  uploadDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().datetime().optional(),
  rejectedBy: z.string().uuid().optional(),
  rejectedAt: z.string().datetime().optional(),
  rejectionReason: z.string().optional(),
  
  isRequired: z.boolean(),
  hasExpiryDate: z.boolean(),
  fileSize: z.number().positive().optional(),
  mimeType: z.string().optional(),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DocumentListFiltersSchema = z.object({
  status: DocumentStatusSchema.optional(),
  type: DocumentTypeSchema.optional(),
  category: DocumentCategorySchema.optional(),
  userType: z.enum(['driver', 'operator']).optional(),
  userId: z.string().uuid().optional(),
  expiringInDays: z.number().positive().optional(),
  search: z.string().optional(),
});

export const DocumentApprovalDataSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

export const BulkApprovalDataSchema = z.object({
  documentIds: z.array(z.string().uuid()).min(1),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});
