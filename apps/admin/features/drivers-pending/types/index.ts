/**
 * DriversPending Types
 */

export interface PendingDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  verificationStatus: 'pending' | 'docs_uploaded' | 'in_review';
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
