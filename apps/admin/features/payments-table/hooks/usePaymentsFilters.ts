/**
 * usePaymentsFilters Hook
 * Manages all filter state for payments table
 * 100% Reutilizabil pattern
 */

'use client';

import { useState, useMemo } from 'react';
import type { DateRange, AmountRange } from '@vantage-lane/ui-core';

export interface PaymentsFilters {
  status: string;
  dateRange: DateRange;
  amountRange: AmountRange;
  search: string;
}

export function usePaymentsFilters() {
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [amountRange, setAmountRange] = useState<AmountRange>({
    min: null,
    max: null,
  });
  const [search, setSearch] = useState<string>('');

  const clearAll = () => {
    setStatus('');
    setDateRange({ from: null, to: null });
    setAmountRange({ min: null, max: null });
    setSearch('');
  };

  const hasActiveFilters = useMemo(
    () =>
      status !== '' ||
      dateRange.from !== null ||
      dateRange.to !== null ||
      amountRange.min !== null ||
      amountRange.max !== null ||
      search !== '',
    [status, dateRange, amountRange, search]
  );

  return {
    filters: {
      status,
      dateRange,
      amountRange,
      search,
    },
    setStatus,
    setDateRange,
    setAmountRange,
    setSearch,
    clearAll,
    hasActiveFilters,
  };
}
