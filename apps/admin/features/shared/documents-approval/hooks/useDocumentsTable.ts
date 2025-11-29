/**
 * useDocumentsTable Hook
 * 
 * Custom hook for documents table state and logic
 * 
 * ✅ Zero any types
 * ✅ Reusable table logic
 * ✅ Centralized state management
 */

import React, { useMemo, useState } from 'react';
import { useColumnResize, useSelection, useSorting } from '@vantage-lane/ui-core';
import type { Document } from '@entities/document';
import { getDocumentsColumns } from '../columns/documentsColumns';
import { calculatePagination, paginateDocuments, sortDocuments, type DocumentActionHandlers } from '../utils/documentsUtils';

export function useDocumentsTable(
  documents: Document[],
  actionHandlers: DocumentActionHandlers
) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Table hooks
  const sorting = useSorting();
  const resize = useColumnResize();

  // Get columns with handlers (memoized)
  const columns = React.useMemo(
    () => getDocumentsColumns(actionHandlers),
    []
  );

  // Data processing - sorting and pagination
  const sortedDocs = useMemo(() => {
    return sortDocuments(documents, sorting, columns);
  }, [documents, sorting, columns]);

  const { totalPages } = calculatePagination(sortedDocs.length, pageSize);
  
  const paginatedDocs = useMemo(() => {
    return paginateDocuments(sortedDocs, currentPage, pageSize);
  }, [sortedDocs, currentPage, pageSize]);

  // Selection based on paginated data
  const selection = useSelection({
    data: paginatedDocs,
    getRowId: (doc) => doc.id,
  });

  // Reset to page 1 when sorting changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sorting.columnId, sorting.direction]);

  return {
    // Table data
    columns,
    paginatedDocs,
    
    // Hooks
    sorting,
    resize,
    selection,
    
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems: documents.length,
  };
}
