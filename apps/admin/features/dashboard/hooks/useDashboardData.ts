/**
 * Dashboard Data Fetching Hook
 * 
 * Handles SWR data fetching for dashboard charts
 * Converts pence to pounds for display
 */

import useSWR from 'swr';
import { useMemo } from 'react';

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
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
  [key: string]: string | number; // Index signature for StackedBarChart compatibility
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

export function useDashboardData(apiParams: URLSearchParams) {
  const { data: charts, isLoading, error } = useSWR<RawChartsData>(
    `/api/dashboard/charts?${apiParams}`,
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 60 * 1000,
      revalidateOnFocus: false,
    }
  );

  // Convert pence to pounds for display
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
        revenue: item.revenue / 100, // Convert pence to pounds
        commission: item.commission / 100, // Convert pence to pounds
      })),
      status_distribution: charts.status_distribution || [],
    };
  }, [charts]);

  return {
    data: convertedCharts,
    isLoading,
    error,
  };
}
