/**
 * Document Entity - Constants
 * Document types, status mappings, labels
 * 
 * MODERN & PREMIUM - Human-readable labels
 */

export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  EXPIRING_SOON: 'expiring_soon',
} as const;

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
  expiring_soon: 'Expiring Soon',
};

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  expired: 'error',
  expiring_soon: 'warning',
};

// Driver Documents
export const DRIVER_DOCUMENT_LABELS: Record<string, string> = {
  driving_licence: 'DVLA Driving Licence',
  electronic_counterpart: 'Electronic Counterpart',
  pco_licence: 'Private Hire Driver Licence',
  bank_statement: 'Bank Statement',
  profile_photo: 'Profile Photo',
  proof_of_identity: 'Proof of Identity',
};

export const DRIVER_DOCUMENT_DESCRIPTIONS: Record<string, string> = {
  driving_licence: 'UK plastic driving licence (front side)',
  electronic_counterpart: 'DVLA electronic counterpart check code',
  pco_licence: 'TfL PCO licence for private hire drivers',
  bank_statement: 'Recent bank statement for payments',
  profile_photo: 'Approved profile photo',
  proof_of_identity: 'Valid ID document (passport, national ID)',
};

// Vehicle Documents
export const VEHICLE_DOCUMENT_LABELS: Record<string, string> = {
  phv_licence: 'Private Hire Vehicle Licence',
  mot_certificate: 'MOT Certificate',
  insurance_certificate: 'Insurance Certificate',
  v5c_logbook: 'V5C Logbook',
  hire_agreement: 'Hire Agreement',
  vehicle_schedule: 'Vehicle Schedule',
  driver_schedule: 'Driver Schedule',
};

export const VEHICLE_DOCUMENT_DESCRIPTIONS: Record<string, string> = {
  phv_licence: 'TfL PHV licence for your vehicle',
  mot_certificate: 'Valid MOT certificate (6 months for PHV)',
  insurance_certificate: 'Private hire insurance coverage',
  v5c_logbook: 'Vehicle registration document (both pages)',
  hire_agreement: 'Vehicle hire contract or permission letter',
  vehicle_schedule: 'Insurance vehicle schedule',
  driver_schedule: 'Insurance driver schedule',
};

// Required documents for driver activation
export const REQUIRED_DRIVER_DOCUMENTS = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'bank_statement',
  'profile_photo',
  'proof_of_identity',
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
] as const;

// Documents that require expiry date
export const DOCUMENTS_WITH_EXPIRY = [
  'driving_licence',
  'electronic_counterpart',
  'pco_licence',
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
] as const;

// Helper function to get document label
export function getDocumentLabel(type: string): string {
  return DRIVER_DOCUMENT_LABELS[type] || VEHICLE_DOCUMENT_LABELS[type] || type;
}

// Helper function to get document description
export function getDocumentDescription(type: string): string {
  return DRIVER_DOCUMENT_DESCRIPTIONS[type] || VEHICLE_DOCUMENT_DESCRIPTIONS[type] || '';
}

// Helper function to check if document requires expiry
export function requiresExpiryDate(type: string): boolean {
  return DOCUMENTS_WITH_EXPIRY.includes(type as any);
}

// Helper function to check if document is required
export function isRequiredDocument(type: string): boolean {
  return REQUIRED_DRIVER_DOCUMENTS.includes(type as any);
}
