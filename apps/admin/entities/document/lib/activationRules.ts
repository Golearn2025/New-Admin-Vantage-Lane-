/**
 * Document Entity - Activation Rules
 * Business logic for driver auto-activation
 * 
 * MODERN & PREMIUM - Smart activation logic
 * File: < 200 lines (RULES.md compliant)
 */

import type { Document } from '../model/types';
import { REQUIRED_DRIVER_DOCUMENTS } from '../model/constants';

export interface ActivationEligibility {
  canActivate: boolean;
  missingDocuments: string[];
  rejectedDocuments: string[];
  expiredDocuments: string[];
  reason?: string;
}

/**
 * Check if driver is eligible for activation
 * All required documents must be approved and not expired
 */
export function checkDriverActivationEligibility(
  documents: Document[]
): ActivationEligibility {
  const missing: string[] = [];
  const rejected: string[] = [];
  const expired: string[] = [];
  
  // Create a map of documents by type
  const docMap = new Map<string, Document>();
  documents.forEach((doc) => {
    docMap.set(doc.type, doc);
  });
  
  // Check each required document
  for (const requiredType of REQUIRED_DRIVER_DOCUMENTS) {
    const doc = docMap.get(requiredType);
    
    if (!doc) {
      missing.push(requiredType);
      continue;
    }
    
    if (doc.status === 'rejected') {
      rejected.push(requiredType);
    } else if (doc.status === 'expired') {
      expired.push(requiredType);
    } else if (doc.status !== 'approved') {
      missing.push(requiredType);
    }
  }
  
  // Determine eligibility
  const canActivate =
    missing.length === 0 &&
    rejected.length === 0 &&
    expired.length === 0;
  
  let reason: string | undefined;
  if (!canActivate) {
    const reasons: string[] = [];
    if (missing.length > 0) {
      reasons.push(`${missing.length} document(s) not approved`);
    }
    if (rejected.length > 0) {
      reasons.push(`${rejected.length} document(s) rejected`);
    }
    if (expired.length > 0) {
      reasons.push(`${expired.length} document(s) expired`);
    }
    reason = reasons.join(', ');
  }
  
  return {
    canActivate,
    missingDocuments: missing,
    rejectedDocuments: rejected,
    expiredDocuments: expired,
    ...(reason && { reason }),
  };
}

/**
 * Calculate days until document expiry
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if document is expiring soon (< 30 days)
 */
export function isExpiringSoon(expiryDate: string | undefined): boolean {
  if (!expiryDate) return false;
  const days = getDaysUntilExpiry(expiryDate);
  return days > 0 && days <= 30;
}

/**
 * Check if document is expired
 */
export function isExpired(expiryDate: string | undefined): boolean {
  if (!expiryDate) return false;
  const days = getDaysUntilExpiry(expiryDate);
  return days <= 0;
}

/**
 * Get document status based on expiry
 */
export function getDocumentStatusFromExpiry(
  currentStatus: string,
  expiryDate: string | undefined
): string {
  if (!expiryDate) return currentStatus;
  
  if (isExpired(expiryDate)) return 'expired';
  if (isExpiringSoon(expiryDate)) return 'expiring_soon';
  
  return currentStatus;
}
