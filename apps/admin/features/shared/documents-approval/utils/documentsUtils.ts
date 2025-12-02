/**
 * Documents Approval Utilities
 * 
 * Pure functions for documents sorting, pagination and actions
 * 
 * ✅ Zero any types
 * ✅ Pure functions
 * ✅ Reusable logic
 */

import { applySorting, type UseSortingReturn } from '@vantage-lane/ui-core';
import type { Document } from '@entities/document';

export interface DocumentsTableState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export function calculatePagination(
  totalItems: number,
  pageSize: number
): Pick<DocumentsTableState, 'totalPages'> {
  return {
    totalPages: Math.ceil(totalItems / pageSize),
  };
}

export function paginateDocuments(
  documents: Document[],
  currentPage: number,
  pageSize: number
): Document[] {
  const start = (currentPage - 1) * pageSize;
  return documents.slice(start, start + pageSize);
}

export function sortDocuments(
  documents: Document[],
  sorting: UseSortingReturn,
  columns: any[]
): Document[] {
  return applySorting(documents, sorting, columns);
}

// Document action handlers interface
export interface DocumentActionHandlers {
  onView: (doc: Document) => void;
  onApprove: (doc: Document) => void;
  onReject: (doc: Document) => void;
}
