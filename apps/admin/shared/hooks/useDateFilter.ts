/**
 * useDateFilter Hook
 *
 * State management for date filtering
 * Syncs date range across dashboard components
 */

import { useState, useCallback } from 'react';
import type { DateRange, DatePreset } from '@vantage-lane/ui-dashboard';
import { getDateRangeForPreset, formatDateForAPI } from '@vantage-lane/ui-dashboard';

export interface UseDateFilterResult {
  /** Current date range */
  dateRange: DateRange;

  /** Current preset (if any) */
  preset: DatePreset;

  /** Set date range by preset */
  setPreset: (preset: DatePreset) => void;

  /** Set custom date range */
  setCustomRange: (range: DateRange) => void;

  /** Get formatted date range for API */
  getAPIParams: () => { start_date: string; end_date: string };

  /** Reset to default (this_month) */
  reset: () => void;
}

/**
 * Hook to manage date filter state
 */
export function useDateFilter(defaultPreset: DatePreset = 'this_month'): UseDateFilterResult {
  const [preset, setPresetState] = useState<DatePreset>(defaultPreset);
  const [dateRange, setDateRange] = useState<DateRange>(() => getDateRangeForPreset(defaultPreset));

  const setPreset = useCallback((newPreset: DatePreset) => {
    setPresetState(newPreset);
    const range = getDateRangeForPreset(newPreset);
    setDateRange(range);
  }, []);

  const setCustomRange = useCallback((range: DateRange) => {
    setPresetState('custom');
    setDateRange(range);
  }, []);

  const getAPIParams = useCallback(() => {
    return {
      start_date: formatDateForAPI(dateRange.start),
      end_date: formatDateForAPI(dateRange.end),
    };
  }, [dateRange]);

  const reset = useCallback(() => {
    setPreset(defaultPreset);
  }, [defaultPreset, setPreset]);

  return {
    dateRange,
    preset,
    setPreset,
    setCustomRange,
    getAPIParams,
    reset,
  };
}
