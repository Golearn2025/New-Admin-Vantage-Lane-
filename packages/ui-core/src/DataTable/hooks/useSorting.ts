'use client';

/**
 * useSorting Hook
 * Modular sorting state management
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface UseSortingOptions {
  /** Initial column to sort by */
  initialColumnId?: string | null;
  /** Initial sort direction */
  initialDirection?: SortDirection;
}

export interface UseSortingReturn {
  /** Current column being sorted */
  columnId: string | null;
  /** Current sort direction */
  direction: SortDirection;
  /** Toggle sort for a column */
  toggleSort: (columnId: string) => void;
  /** Set specific sort */
  setSort: (columnId: string | null, direction: SortDirection) => void;
  /** Clear sorting */
  clearSort: () => void;
  /** Check if column is sorted */
  isSorted: (columnId: string) => boolean;
  /** Get sort direction for column */
  getSortDirection: (columnId: string) => SortDirection;
}

export function useSorting(
  options: UseSortingOptions = {}
): UseSortingReturn {
  const {
    initialColumnId = null,
    initialDirection = null,
  } = options;

  const [columnId, setColumnId] = useState<string | null>(initialColumnId);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const toggleSort = useCallback((newColumnId: string) => {
    if (columnId === newColumnId) {
      // Same column - toggle direction
      if (direction === 'asc') {
        setDirection('desc');
      } else if (direction === 'desc') {
        setDirection(null);
        setColumnId(null);
      } else {
        setDirection('asc');
      }
    } else {
      // New column - start with asc
      setColumnId(newColumnId);
      setDirection('asc');
    }
  }, [columnId, direction]);

  const setSort = useCallback((newColumnId: string | null, newDirection: SortDirection) => {
    setColumnId(newColumnId);
    setDirection(newDirection);
  }, []);

  const clearSort = useCallback(() => {
    setColumnId(null);
    setDirection(null);
  }, []);

  const isSorted = useCallback((checkColumnId: string) => {
    return columnId === checkColumnId && direction !== null;
  }, [columnId, direction]);

  const getSortDirection = useCallback((checkColumnId: string): SortDirection => {
    return columnId === checkColumnId ? direction : null;
  }, [columnId, direction]);

  return {
    columnId,
    direction,
    toggleSort,
    setSort,
    clearSort,
    isSorted,
    getSortDirection,
  };
}
