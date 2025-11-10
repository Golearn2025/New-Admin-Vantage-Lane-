/**
 * Document Entity - API (Re-exports)
 * Main entry point for document API operations
 * 
 * MODERN & PREMIUM - Clean architecture
 * File: < 50 lines (RULES.md compliant)
 */

// Re-export queries (read operations)
export {
  listDocuments,
  getDocumentById,
  getDriverDocuments,
  getDocumentCounts,
  checkDriverDocumentsComplete,
} from './documentQueries';

// Re-export mutations (write operations)
export {
  approveDocument,
  rejectDocument,
  bulkApproveDocuments,
  bulkRejectDocuments,
  deleteDocument,
} from './documentMutations';

// Re-export types
export type {
  Document,
  DocumentListFilters,
  DocumentApprovalData,
  BulkApprovalData,
} from '../model/types';
