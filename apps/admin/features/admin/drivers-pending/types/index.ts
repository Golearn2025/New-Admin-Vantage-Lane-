/**
 * DriversPending Types
 */

export interface PendingDriver {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  verificationStatus: 'pending' | 'docs_uploaded' | 'in_review' | 'not_uploaded';
  // Separate document counts for driver and vehicle
  driverDocsApproved: number;
  driverDocsRequired: number;
  vehicleDocsApproved: number;
  vehicleDocsRequired: number;
  // Legacy (kept for backward compatibility)
  documentsCount: number;
  requiredDocumentsCount: number;
  profilePhotoUrl: string | null;
  createdAt: string;
  uploadedAt: string | null;
}

export interface PendingDriversFilters {
  status?: 'pending' | 'docs_uploaded' | 'in_review';
  hasAllDocs?: boolean;
}
