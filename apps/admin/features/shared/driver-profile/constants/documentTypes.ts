/**
 * Document Types and Rejection Reasons Constants
 * 
 * Based on app-driver document structure
 */

export const DRIVER_DOCUMENT_TYPES = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'bank_statement',
  'profile_photo',
  'proof_of_identity',
] as const;

export const VEHICLE_DOCUMENT_TYPES = [
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
  'hire_agreement',
  'vehicle_schedule',
  'driver_schedule',
] as const;

export const DOCUMENT_NAMES: Record<string, string> = {
  // Driver Documents
  driving_licence: 'DVLA Driving Licence',
  electronic_counterpart: 'Electronic Counterpart',
  pco_licence: 'Private Hire Driver Licence',
  bank_statement: 'Bank Statement',
  profile_photo: 'Profile Photo',
  proof_of_identity: 'Proof of Identity',
  
  // Vehicle Documents
  phv_licence: 'Private Hire Vehicle Licence',
  mot_certificate: 'MOT Certificate',
  insurance_certificate: 'Insurance Certificate',
  v5c_logbook: 'V5C Logbook',
  hire_agreement: 'Hire Agreement',
  vehicle_schedule: 'Vehicle Schedule',
  driver_schedule: 'Driver Schedule',
};

export const REJECTION_REASONS = [
  'Document expired',
  'Document not clear/illegible',
  'Incorrect document type',
  'Information incomplete',
  'Document does not match records',
  'Wrong name on document',
  'Document damaged or altered',
  'Other (please specify)',
] as const;

export type RejectionReason = typeof REJECTION_REASONS[number];

export const DOCUMENTS_REQUIRING_EXPIRY = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
] as const;
