/**
 * Driver Document Types - Public API
 */

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
} from './document.types';

export {
  DOCUMENT_METADATA,
  DRIVER_DOCUMENT_TYPES,
  VEHICLE_DOCUMENT_TYPES,
  getDocumentMetadata,
} from './document-metadata';
