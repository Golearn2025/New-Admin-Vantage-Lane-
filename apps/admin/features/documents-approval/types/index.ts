/**
 * Documents Approval Feature - Types
 * UI-specific types for documents approval
 * 
 * MODERN & PREMIUM
 */

import type { Document, DocumentStatus } from '@entities/document';

export interface DocumentsApprovalFilters {
  tab: 'all' | 'pending' | 'expiring' | 'expired';
  search: string;
  userType?: 'driver' | 'operator';
}

export interface ApprovalAction {
  type: 'approve' | 'reject' | 'view';
  documentId: string;
  document: Document;
}

export interface BulkApprovalAction {
  type: 'approve' | 'reject';
  documentIds: string[];
}

export type DocumentTab = 'all' | 'pending' | 'expiring' | 'expired';
