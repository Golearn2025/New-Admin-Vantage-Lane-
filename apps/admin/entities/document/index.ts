/**
 * Document Entity - Public API
 * Barrel export for document entity
 * 
 * MODERN & PREMIUM - Clean exports
 */

// Types
export type {
  Document,
  DocumentStatus,
  DocumentType,
  DriverDocumentType,
  VehicleDocumentType,
  DocumentCategory,
  DocumentListFilters,
  DocumentApprovalData,
  BulkApprovalData,
} from './model/types';

// Schemas
export {
  DocumentSchema,
  DocumentStatusSchema,
  DocumentTypeSchema,
  DriverDocumentTypeSchema,
  VehicleDocumentTypeSchema,
  DocumentCategorySchema,
  DocumentListFiltersSchema,
  DocumentApprovalDataSchema,
  BulkApprovalDataSchema,
} from './model/schema';

// Constants
export {
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DRIVER_DOCUMENT_LABELS,
  DRIVER_DOCUMENT_DESCRIPTIONS,
  VEHICLE_DOCUMENT_LABELS,
  VEHICLE_DOCUMENT_DESCRIPTIONS,
  REQUIRED_DRIVER_DOCUMENTS,
  DOCUMENTS_WITH_EXPIRY,
  getDocumentLabel,
  getDocumentDescription,
  requiresExpiryDate,
  isRequiredDocument,
} from './model/constants';

// API
export {
  listDocuments,
  getDocumentById,
  getDriverDocuments,
  approveDocument,
  bulkApproveDocuments,
  deleteDocument,
  getDocumentCounts,
  checkDriverDocumentsComplete,
} from './api/documentApi';

// Business logic
export {
  checkDriverActivationEligibility,
  getDaysUntilExpiry,
  isExpiringSoon,
  isExpired,
  getDocumentStatusFromExpiry,
} from './lib/activationRules';

export type { ActivationEligibility } from './lib/activationRules';
