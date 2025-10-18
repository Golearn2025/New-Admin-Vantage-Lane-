/**
 * useDashboardMetrics Hook
 * 
 * Fetches dashboard metrics from API with SWR caching
 * - Auto-refresh: 5 minutes
 * - Dedupe: 60 seconds
 * - No refetch on focus/reconnect (prevents unnecessary loads)
 * 
 * MAX 80 LINES (current: 65)
 */

import useSWR from 'swr';

export interface DashboardMetrics {
  // Row 1: Financial Overview
  total_revenue_pence: number;
  total_bookings: number;
  avg_booking_pence: number;
  platform_commission_pence: number;
  
  // Row 2: Operations & Future
  operator_payout_pence: number;
  cancelled_count: number;
  refunds_total_pence: number;
  scheduled_count: number;
  
  // Meta
  cached: boolean;
  timestamp: string;
}

interface UseDashboardMetricsOptions {
  startDate?: string;
  endDate?: string;
}

interface UseDashboardMetricsResult {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  refresh: () => void;
}

const fetcher = async (url: string): Promise<DashboardMetrics> => {
  const res = await fetch(url, {
    credentials: 'include', // Include auth cookies
  });
  
  if (!res.ok) {
    interface FetchError extends Error {
      status?: number;
    }
    const error: FetchError = new Error('Failed to fetch dashboard metrics');
    error.status = res.status;
    throw error;
  }
  
  return res.json();
};

/**
 * Hook to fetch dashboard metrics with SWR caching
 */
export function useDashboardMetrics(options?: UseDashboardMetricsOptions): UseDashboardMetricsResult {
  // Build API URL with query params
  const apiUrl = options?.startDate && options?.endDate
    ? `/api/dashboard/metrics?start_date=${options.startDate}&end_date=${options.endDate}`
    : '/api/dashboard/metrics';
  const { data, error, isLoading, mutate } = useSWR<DashboardMetrics>(
    apiUrl,
    fetcher,
    {
      // Show 0 values instantly instead of loading skeleton
      fallbackData: {
        total_revenue_pence: 0,
        total_bookings: 0,
        avg_booking_pence: 0,
        platform_commission_pence: 0,
        operator_payout_pence: 0,
        cancelled_count: 0,
        refunds_total_pence: 0,
        scheduled_count: 0,
        cached: false,
        timestamp: new Date().toISOString(),
      },
      
      // Refresh every 5 minutes
      refreshInterval: 5 * 60 * 1000,
      
      // Dedupe requests within 60 seconds
      dedupingInterval: 60 * 1000,
      
      // Don't refetch on window focus (prevents excessive calls)
      revalidateOnFocus: false,
      
      // Don't refetch on reconnect
      revalidateOnReconnect: false,
      
      // Keep previous data while revalidating
      keepPreviousData: true,
    }
  );

  return {
    metrics: data,
    isLoading,
    isError: !!error,
    error,
    refresh: () => mutate(),
  };
}
