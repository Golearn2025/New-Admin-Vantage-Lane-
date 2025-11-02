/**
 * useSelection Hook
 * Modular row selection with checkboxes
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback, useMemo } from 'react';

export interface UseSelectionOptions<T = any> {
  /** Data rows */
  data: T[];
  /** Function to get unique row ID */
  getRowId?: (row: T, index: number) => string;
  /** Initial selected IDs */
  initialSelectedIds?: Set<string>;
}

export interface UseSelectionReturn<T = any> {
  /** Selected row IDs */
  selectedIds: Set<string>;
  /** Selected rows data */
  selectedRows: T[];
  /** Number of selected rows */
  selectedCount: number;
  /** Are all rows selected? */
  isAllSelected: boolean;
  /** Is selection indeterminate? (some but not all) */
  isIndeterminate: boolean;
  /** Check if row is selected */
  isRowSelected: (rowId: string) => boolean;
  /** Toggle row selection */
  toggleRow: (rowId: string) => void;
  /** Toggle all rows */
  toggleAll: () => void;
  /** Select specific rows */
  selectRows: (rowIds: string[]) => void;
  /** Deselect specific rows */
  deselectRows: (rowIds: string[]) => void;
  /** Clear all selection */
  clearSelection: () => void;
  /** Select all rows */
  selectAll: () => void;
}

export function useSelection<T = any>(
  options: UseSelectionOptions<T>
): UseSelectionReturn<T> {
  const {
    data,
    getRowId = (row, index) => String(index),
    initialSelectedIds = new Set<string>(),
  } = options;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    initialSelectedIds
  );

  // Get all row IDs
  const allRowIds = useMemo(
    () => data.map((row, index) => getRowId(row, index)),
    [data, getRowId]
  );

  // Get selected rows
  const selectedRows = useMemo(
    () =>
      data.filter((row, index) => {
        const rowId = getRowId(row, index);
        return selectedIds.has(rowId);
      }),
    [data, selectedIds, getRowId]
  );

  const selectedCount = selectedIds.size;
  const isAllSelected = selectedCount > 0 && selectedCount === data.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < data.length;

  const isRowSelected = useCallback(
    (rowId: string) => selectedIds.has(rowId),
    [selectedIds]
  );

  const toggleRow = useCallback((rowId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allRowIds));
    }
  }, [isAllSelected, allRowIds]);

  const selectRows = useCallback((rowIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rowIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const deselectRows = useCallback((rowIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rowIds.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(allRowIds));
  }, [allRowIds]);

  return {
    selectedIds,
    selectedRows,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isRowSelected,
    toggleRow,
    toggleAll,
    selectRows,
    deselectRows,
    clearSelection,
    selectAll,
  };
}
