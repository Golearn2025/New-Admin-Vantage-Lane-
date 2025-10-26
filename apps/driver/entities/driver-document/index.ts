/**
 * Driver Document Entity - Public API
 * 
 * Entity layer for driver document management.
 * Contains types, API functions, and validation schemas.
 */

// Types
export type {
  DocumentStatus,
  DriverDocumentType,
  VehicleDocumentType,
  DocumentType,
  DocumentCategory,
  DriverDocument,
  DocumentUploadPayload,
  DocumentUpdatePayload,
  DocumentWithExpiry,
  DocumentTypeMetadata,
} from './types';

export {
  DOCUMENT_METADATA,
  DRIVER_DOCUMENT_TYPES,
  VEHICLE_DOCUMENT_TYPES,
  getDocumentMetadata,
} from './types';

// API Functions
export {
  getDocuments,
  getDocumentByType,
  uploadDocument,
  updateDocument,
  updateDocumentExpiry,
  updateDocumentNotes,
  deleteDocument,
} from './api';

// Schemas
export {
  documentStatusSchema,
  driverDocumentTypeSchema,
  vehicleDocumentTypeSchema,
  documentTypeSchema,
  documentCategorySchema,
  driverDocumentSchema,
  documentUploadPayloadSchema,
  documentUpdatePayloadSchema,
  validateDocumentUpload,
  validateDocumentUpdate,
} from './schemas';
