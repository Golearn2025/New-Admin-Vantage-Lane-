/**
 * useDisputesFilters Hook
 * Manages all filter state for disputes table
 * 100% Reutilizabil pattern
 */

'use client';

import { useState, useMemo } from 'react';
import type { DateRange } from '@vantage-lane/ui-core';

export interface DisputesFilters {
  status: string;
  dateRange: DateRange;
  search: string;
}

export function useDisputesFilters() {
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [search, setSearch] = useState<string>('');

  const clearAll = () => {
    setStatus('');
    setDateRange({ from: null, to: null });
    setSearch('');
  };

  const hasActiveFilters = useMemo(
    () =>
      status !== '' ||
      dateRange.from !== null ||
      dateRange.to !== null ||
      search !== '',
    [status, dateRange, search]
  );

  return {
    filters: {
      status,
      dateRange,
      search,
    },
    setStatus,
    setDateRange,
    setSearch,
    clearAll,
    hasActiveFilters,
  };
}
