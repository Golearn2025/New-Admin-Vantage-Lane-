/**
 * Dashboard Charts Hook
 *
 * Handles chart data fetching with caching and spam protection.
 * SWR-based with 60s cache, deduping, and memoized transformations.
 *
 * Ver 2.4 - PAS 3
 */

'use client';

import { useMemo } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch charts');
  return res.json();
};

interface ChartDataPoint {
  x: string;
  y: number;
}

interface OperatorPerformancePoint {
  x: string;
  bookings: number;
  revenue: number;
  commission: number;
  [key: string]: string | number;
}

interface StatusDistributionPoint {
  name: string;
  value: number;
}

interface RawChartsData {
  weekly_activity?: ChartDataPoint[];
  revenue_trend?: ChartDataPoint[];
  operator_performance?: OperatorPerformancePoint[];
  status_distribution?: StatusDistributionPoint[];
}

interface ConvertedChartsData {
  weekly_activity: ChartDataPoint[];
  revenue_trend: ChartDataPoint[];
  operator_performance: OperatorPerformancePoint[];
  status_distribution: StatusDistributionPoint[];
}

export interface UseDashboardChartsReturn {
  data: ConvertedChartsData | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching and transforming dashboard charts data
 *
 * Features:
 * - 60s cache with SWR
 * - Automatic deduplication (60s window)
 * - Pence to pounds conversion
 * - Memoized transformations
 */
export function useDashboardCharts(apiParams: URLSearchParams): UseDashboardChartsReturn {
  const {
    data: charts,
    isLoading,
    error,
  } = useSWR<RawChartsData>(`/api/dashboard/charts?${apiParams}`, fetcher, {
    refreshInterval: 5 * 60 * 1000, // 5 min auto-refresh
    dedupingInterval: 60 * 1000, // 60s deduplication
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 2, // ✅ Stop aggressive retries on 500 errors
  });

  // Convert pence to pounds for display - memoized
  const convertedCharts = useMemo<ConvertedChartsData | null>(() => {
    if (!charts) return null;

    return {
      weekly_activity: charts.weekly_activity || [],
      revenue_trend: (charts.revenue_trend || []).map((item) => ({
        x: item.x,
        y: item.y / 100, // Convert pence to pounds
      })),
      operator_performance: (charts.operator_performance || []).map((item) => ({
        x: item.x,
        bookings: item.bookings,
        revenue: item.revenue / 100,
        commission: item.commission / 100,
      })),
      status_distribution: charts.status_distribution || [],
    };
  }, [charts]);

  return {
    data: convertedCharts,
    isLoading,
    error: error || null,
  };
}
