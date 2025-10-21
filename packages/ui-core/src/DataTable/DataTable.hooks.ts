/**
 * DataTable Custom Hooks - Simplified
 * Reusable hooks for table logic (sort, selection, pagination)
 */

import { useState, useCallback } from 'react';
import type { SortState } from './types/index';

/**
 * Hook for sorting logic
 */
export function useTableSort(initialSort?: SortState) {
  const [sortState, setSortState] = useState<SortState>(
    initialSort || { columnId: null, direction: null }
  );

  const handleSort = useCallback((columnId: string) => {
    setSortState((prev: SortState) => {
      // Same column - cycle through asc -> desc -> null
      if (prev.columnId === columnId) {
        if (prev.direction === 'asc') {
          return { columnId, direction: 'desc' };
        }
        if (prev.direction === 'desc') {
          return { columnId: null, direction: null };
        }
      }
      // New column - start with asc
      return { columnId, direction: 'asc' };
    });
  }, []);

  return { sortState, handleSort };
}

/**
 * Hook for selection logic (simplified)
 */
export function useTableSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = useCallback((allIds: string[]) => {
    setSelectedIds((prev: Set<string>) => {
      if (prev.size === allIds.length && allIds.length > 0) {
        // Deselect all
        return new Set();
      }
      // Select all
      return new Set(allIds);
    });
  }, []);

  const handleSelectRow = useCallback((rowId: string) => {
    setSelectedIds((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
  };
}

/**
 * Hook for pagination logic (simplified)
 */
export function useTablePagination(totalItems: number, initialPageSize = 10) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = useCallback((newPageIndex: number) => {
    setPageIndex(newPageIndex);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0); // Reset to first page
  }, []);

  return {
    pageIndex,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
  };
}
