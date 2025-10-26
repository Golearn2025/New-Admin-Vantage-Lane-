/**
 * Document Type Metadata
 * 
 * Configuration and metadata for each document type.
 */

import type { DocumentType, DocumentTypeMetadata } from './document.types';

/**
 * Document type metadata mapping
 */
export const DOCUMENT_METADATA: Record<DocumentType, DocumentTypeMetadata> = {
  // Driver Documents
  driving_licence: {
    type: 'driving_licence',
    label: 'Driving Licence',
    description: 'UK driving licence photo card',
    required: true,
    has_expiry: true,
    icon: '🪪',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  electronic_counterpart: {
    type: 'electronic_counterpart',
    label: 'Electronic Counterpart',
    description: 'DVLA counterpart code',
    required: true,
    has_expiry: false,
    icon: '📄',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  pco_licence: {
    type: 'pco_licence',
    label: 'PCO Licence',
    description: 'Private hire driver licence',
    required: true,
    has_expiry: true,
    icon: '🎫',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  bank_statement: {
    type: 'bank_statement',
    label: 'Bank Statement',
    description: 'Recent bank statement for verification',
    required: true,
    has_expiry: false,
    icon: '🏦',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  profile_photo: {
    type: 'profile_photo',
    label: 'Profile Photo',
    description: 'Professional headshot',
    required: true,
    has_expiry: false,
    icon: '📸',
    accept: 'image/jpeg,image/jpg,image/png,image/webp',
    max_size_mb: 5,
  },
  proof_of_identity: {
    type: 'proof_of_identity',
    label: 'Proof of Identity',
    description: 'Passport or national ID',
    required: true,
    has_expiry: false,
    icon: '🛂',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  
  // Vehicle Documents
  phv_licence: {
    type: 'phv_licence',
    label: 'PHV Licence',
    description: 'Private hire vehicle licence',
    required: true,
    has_expiry: true,
    icon: '🚕',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  mot_certificate: {
    type: 'mot_certificate',
    label: 'MOT Certificate',
    description: 'Valid MOT test certificate',
    required: true,
    has_expiry: true,
    icon: '🔧',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  insurance_certificate: {
    type: 'insurance_certificate',
    label: 'Insurance Certificate',
    description: 'Vehicle insurance certificate',
    required: true,
    has_expiry: true,
    icon: '🛡️',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  v5c_logbook: {
    type: 'v5c_logbook',
    label: 'V5C Logbook',
    description: 'Vehicle registration document',
    required: true,
    has_expiry: false,
    icon: '📋',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  hire_agreement: {
    type: 'hire_agreement',
    label: 'Hire Agreement',
    description: 'Vehicle hire or lease agreement',
    required: false,
    has_expiry: false,
    icon: '📝',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  vehicle_schedule: {
    type: 'vehicle_schedule',
    label: 'Vehicle Schedule',
    description: 'Operator vehicle schedule',
    required: false,
    has_expiry: false,
    icon: '📅',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
  driver_schedule: {
    type: 'driver_schedule',
    label: 'Driver Schedule',
    description: 'Operator driver schedule',
    required: false,
    has_expiry: false,
    icon: '📆',
    accept: 'image/*,application/pdf',
    max_size_mb: 10,
  },
};

/**
 * Get document metadata by type
 */
export function getDocumentMetadata(type: DocumentType): DocumentTypeMetadata {
  return DOCUMENT_METADATA[type];
}

/**
 * Get all driver document types
 */
export const DRIVER_DOCUMENT_TYPES: DocumentType[] = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'bank_statement',
  'profile_photo',
  'proof_of_identity',
];

/**
 * Get all vehicle document types
 */
export const VEHICLE_DOCUMENT_TYPES: DocumentType[] = [
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
  'hire_agreement',
  'vehicle_schedule',
  'driver_schedule',
];
