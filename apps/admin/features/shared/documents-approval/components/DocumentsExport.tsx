/**
 * DocumentsExport Component
 * 
 * Export functionality for documents data
 * 
 * ✅ Zero any types
 * ✅ Centralized formatters
 * ✅ Pure export logic
 */

import { exportToExcel, formatDateForExport } from '@vantage-lane/ui-core';
import { useMemo } from 'react';
import { formatDate } from '@/shared/utils/formatters';
import type { Document } from '@entities/document';

interface FiltersState {
  tab: string;
  status?: string;
  documentType?: string;
  category?: string;
  search: string;
}

interface DocumentsExportProps {
  documents: Document[];
  filters: FiltersState;
}

export function useDocumentsExport({ documents, filters }: DocumentsExportProps) {
  // Memoize export data transformation to prevent re-creation on every render
  const exportData = useMemo(() => 
    documents.map((doc) => ({
      'Document ID': doc.id,
      Type: doc.type,
      Category: doc.category,
      'Driver Name': doc.userName,
      'Driver Email': doc.userEmail,
      Status: doc.status,
      'Upload Date': formatDateForExport(doc.uploadDate),
      'Expiry Date': doc.expiryDate ? formatDateForExport(doc.expiryDate) : 'N/A',
      'Reviewed By': doc.approvedBy || doc.rejectedBy || 'N/A',
      'Reviewed At': doc.approvedAt
        ? formatDateForExport(doc.approvedAt)
        : doc.rejectedAt
          ? formatDateForExport(doc.rejectedAt)
          : 'N/A',
      'Rejection Reason': doc.rejectionReason || 'N/A',
      'File Size': doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : 'N/A',
      Notes: doc.description || '',
    })), 
    [documents]
  );

  const handleExport = () => {
    const filename = `documents-${filters.tab}-${new Date().toISOString().split('T')[0]}`;
    
    // Export as Excel (CSV with UTF-8 BOM for Excel compatibility)
    exportToExcel(exportData, filename);
  };

  return { handleExport };
}
