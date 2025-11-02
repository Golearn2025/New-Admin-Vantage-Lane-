/**
 * useExpandable Hook
 * Modular expandable rows
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback } from 'react';

export interface UseExpandableOptions {
  /** Initial expanded row IDs */
  initialExpandedIds?: Set<string>;
  /** Allow multiple rows expanded at once */
  allowMultiple?: boolean;
}

export interface UseExpandableReturn {
  /** Expanded row IDs */
  expandedIds: Set<string>;
  /** Number of expanded rows */
  expandedCount: number;
  /** Check if row is expanded */
  isRowExpanded: (rowId: string) => boolean;
  /** Toggle row expansion */
  toggleRow: (rowId: string) => void;
  /** Expand specific row */
  expandRow: (rowId: string) => void;
  /** Collapse specific row */
  collapseRow: (rowId: string) => void;
  /** Expand all rows */
  expandAll: (rowIds: string[]) => void;
  /** Collapse all rows */
  collapseAll: () => void;
}

export function useExpandable(
  options: UseExpandableOptions = {}
): UseExpandableReturn {
  const {
    initialExpandedIds = new Set<string>(),
    allowMultiple = true,
  } = options;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    initialExpandedIds
  );

  const expandedCount = expandedIds.size;

  const isRowExpanded = useCallback(
    (rowId: string) => expandedIds.has(rowId),
    [expandedIds]
  );

  const toggleRow = useCallback(
    (rowId: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(rowId)) {
          next.delete(rowId);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(rowId);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const expandRow = useCallback(
    (rowId: string) => {
      setExpandedIds((prev) => {
        const next = allowMultiple ? new Set(prev) : new Set<string>();
        next.add(rowId);
        return next;
      });
    },
    [allowMultiple]
  );

  const collapseRow = useCallback((rowId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
  }, []);

  const expandAll = useCallback((rowIds: string[]) => {
    setExpandedIds(new Set(rowIds));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return {
    expandedIds,
    expandedCount,
    isRowExpanded,
    toggleRow,
    expandRow,
    collapseRow,
    expandAll,
    collapseAll,
  };
}
