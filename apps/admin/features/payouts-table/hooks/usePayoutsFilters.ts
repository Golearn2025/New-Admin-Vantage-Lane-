/**
 * usePayoutsFilters Hook
 * Manages filter state for payouts table
 * Special: Driver filter for payout grouping
 * < 50 lines - RULES.md compliant
 */

'use client';

import { useState, useMemo } from 'react';
import type { DateRange } from '@vantage-lane/ui-core';

export interface PayoutsFilters {
  driverId: string;
  status: string;
  dateRange: DateRange;
  search: string;
}

export function usePayoutsFilters() {
  const [driverId, setDriverId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [search, setSearch] = useState<string>('');

  const clearAll = () => {
    setDriverId('');
    setStatus('');
    setDateRange({ from: null, to: null });
    setSearch('');
  };

  const hasActiveFilters = useMemo(
    () =>
      driverId !== '' ||
      status !== '' ||
      dateRange.from !== null ||
      dateRange.to !== null ||
      search !== '',
    [driverId, status, dateRange, search]
  );

  return {
    filters: { driverId, status, dateRange, search },
    setDriverId,
    setStatus,
    setDateRange,
    setSearch,
    clearAll,
    hasActiveFilters,
  };
}
