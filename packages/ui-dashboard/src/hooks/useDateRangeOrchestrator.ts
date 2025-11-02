/**
 * useDateRangeOrchestrator - MASTER Hook pentru Date Filtering
 * 
 * Orchestrator general pentru TOATE paginile cu date filters
 * Dashboard, Reports, Analytics, Bookings, etc.
 * 
 * Features:
 * - Preset → Range conversion
 * - Custom range memorat (nu se pierde!)
 * - URL sync (share + refresh)
 * - API params ready
 * 
 * Compliant:
 * - <100 lines
 * - TypeScript strict
 * - Zero side effects în utils
 * - Reutilizabil 100%
 */

'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { DatePreset, DateRange } from '../utils/dateTypes';
import { getDateRangeForPreset } from '../utils/dateRangePresets';
import { startOfDay, endOfDay } from '../utils/datePeriods';

export interface UseDateRangeOrchestratorResult {
  /** Current preset */
  preset: DatePreset;
  
  /** Effective date range (preset sau custom) */
  effectiveRange: DateRange;
  
  /** Change preset */
  setPreset: (preset: DatePreset) => void;
  
  /** Set custom range */
  setCustomRange: (range: DateRange) => void;
  
  /** API params ready */
  apiParams: { start_date: string; end_date: string };
}

/**
 * Master orchestrator pentru date filtering
 * 
 * @param defaultPreset - Default preset (ex: 'last_30_days')
 * @returns Orchestrator result cu preset, range, setters, API params
 * 
 * @example
 * const { preset, effectiveRange, setPreset, setCustomRange, apiParams } = 
 *   useDateRangeOrchestrator('last_30_days');
 */
export function useDateRangeOrchestrator(
  defaultPreset: DatePreset = 'last_30_days'
): UseDateRangeOrchestratorResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Memorează ultimul custom range (NU se pierde!)
  const lastCustomRef = useRef<DateRange | null>(null);
  
  // Initialize from URL sau default
  const [preset, setPresetState] = useState<DatePreset>(() => {
    const urlPreset = searchParams.get('preset') as DatePreset | null;
    return urlPreset || defaultPreset;
  });
  
  const [customRange, setCustomRangeState] = useState<DateRange | null>(() => {
    const urlStart = searchParams.get('start');
    const urlEnd = searchParams.get('end');
    
    if (urlStart && urlEnd) {
      return {
        start: startOfDay(new Date(urlStart)),
        end: endOfDay(new Date(urlEnd)),
        preset: 'custom',
        label: 'Custom Range',
      };
    }
    return null;
  });
  
  // Effective range: custom sau preset
  const effectiveRange = useMemo(() => {
    if (preset === 'custom' && customRange) {
      lastCustomRef.current = customRange; // Memorează!
      return customRange;
    }
    return getDateRangeForPreset(preset);
  }, [preset, customRange]);
  
  // URL sync (share + refresh)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('preset', preset);
    params.set('start', effectiveRange.start.toISOString().split('T')[0] || '');
    params.set('end', effectiveRange.end.toISOString().split('T')[0] || '');
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [preset, effectiveRange, router]);
  
  // Set preset (restaurează custom dacă există)
  const setPreset = useCallback((newPreset: DatePreset) => {
    if (newPreset === 'custom' && lastCustomRef.current) {
      setCustomRangeState(lastCustomRef.current); // Restaurează!
    }
    setPresetState(newPreset);
  }, []);
  
  // Set custom range
  const setCustomRange = useCallback((range: DateRange) => {
    const normalized = {
      ...range,
      start: startOfDay(range.start),
      end: endOfDay(range.end),
      preset: 'custom' as const,
      label: 'Custom Range',
    };
    setCustomRangeState(normalized);
    setPresetState('custom');
  }, []);
  
  // API params ready
  const apiParams = useMemo(() => ({
    start_date: effectiveRange.start.toISOString().split('T')[0] || '',
    end_date: effectiveRange.end.toISOString().split('T')[0] || '',
  }), [effectiveRange]);
  
  return {
    preset,
    effectiveRange,
    setPreset,
    setCustomRange,
    apiParams,
  };
}
