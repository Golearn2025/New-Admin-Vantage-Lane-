/**
 * Documents Approval Feature - Public API
 * Barrel export
 * 
 * MODERN & PREMIUM
 */

export { DocumentsApprovalTable } from './components/DocumentsApprovalTable';
export { useDocumentsApproval } from './hooks/useDocumentsApproval';
export { getDocumentsColumns } from './columns/documentsColumns';

export type {
  DocumentsApprovalFilters,
  ApprovalAction,
  BulkApprovalAction,
  DocumentTab,
} from './types';

export type { DocumentColumnsCallbacks } from './columns/documentsColumns';
