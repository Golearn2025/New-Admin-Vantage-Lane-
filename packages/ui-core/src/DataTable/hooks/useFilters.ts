'use client';

/**
 * useFilters Hook
 * Modular filters state management
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback } from 'react';

export type FilterValue = string | number | boolean | null | undefined;

export interface Filter {
  /** Column key to filter */
  columnKey: string;
  /** Filter value */
  value: FilterValue;
  /** Filter operator */
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface UseFiltersReturn {
  /** Active filters */
  filters: Filter[];
  /** Add or update a filter */
  setFilter: (columnKey: string, value: FilterValue, operator?: Filter['operator']) => void;
  /** Remove a filter */
  removeFilter: (columnKey: string) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Get filter value for column */
  getFilterValue: (columnKey: string) => FilterValue;
  /** Check if column has filter */
  hasFilter: (columnKey: string) => boolean;
  /** Number of active filters */
  activeFilterCount: number;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filter[]>([]);

  const setFilter = useCallback((
    columnKey: string,
    value: FilterValue,
    operator: Filter['operator'] = 'equals'
  ) => {
    setFilters((prev) => {
      const existing = prev.findIndex((f) => f.columnKey === columnKey);
      if (existing >= 0) {
        // Update existing filter
        const updated = [...prev];
        updated[existing] = { columnKey, value, operator };
        return updated;
      } else {
        // Add new filter
        return [...prev, { columnKey, value, operator }];
      }
    });
  }, []);

  const removeFilter = useCallback((columnKey: string) => {
    setFilters((prev) => prev.filter((f) => f.columnKey !== columnKey));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const getFilterValue = useCallback((columnKey: string): FilterValue => {
    const filter = filters.find((f) => f.columnKey === columnKey);
    return filter?.value;
  }, [filters]);

  const hasFilter = useCallback((columnKey: string): boolean => {
    return filters.some((f) => f.columnKey === columnKey);
  }, [filters]);

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    getFilterValue,
    hasFilter,
    activeFilterCount: filters.length,
  };
}
