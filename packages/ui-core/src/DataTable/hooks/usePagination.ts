/**
 * usePagination Hook
 * Modular pagination state management
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  /** Initial page index (0-based) */
  initialPage?: number;
  /** Initial page size */
  initialPageSize?: number;
  /** Total number of items */
  totalCount?: number;
}

export interface UsePaginationReturn {
  /** Current page index (0-based) */
  pageIndex: number;
  /** Current page size */
  pageSize: number;
  /** Total number of items */
  totalCount: number;
  /** Total number of pages */
  pageCount: number;
  /** Go to specific page */
  setPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Change page size */
  setPageSize: (size: number) => void;
  /** Set total count */
  setTotalCount: (count: number) => void;
  /** Check if can go to next page */
  canNextPage: boolean;
  /** Check if can go to previous page */
  canPreviousPage: boolean;
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = 0,
    initialPageSize = 25,
    totalCount: initialTotalCount = 0,
  } = options;

  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  const pageCount = Math.ceil(totalCount / pageSize);
  const canNextPage = pageIndex < pageCount - 1;
  const canPreviousPage = pageIndex > 0;

  const setPage = useCallback((page: number) => {
    setPageIndex(Math.max(0, Math.min(page, pageCount - 1)));
  }, [pageCount]);

  const nextPage = useCallback(() => {
    if (canNextPage) {
      setPageIndex((prev) => prev + 1);
    }
  }, [canNextPage]);

  const previousPage = useCallback(() => {
    if (canPreviousPage) {
      setPageIndex((prev) => prev - 1);
    }
  }, [canPreviousPage]);

  return {
    pageIndex,
    pageSize,
    totalCount,
    pageCount,
    setPage,
    nextPage,
    previousPage,
    setPageSize,
    setTotalCount,
    canNextPage,
    canPreviousPage,
  };
}
