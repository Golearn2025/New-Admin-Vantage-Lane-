/**
 * Operator Metrics Hook
 *
 * Fetch dashboard metrics cu organization_id pentru operator.
 * Wrapper around shared DashboardMetrics cu filtrare automată.
 */

'use client';

import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import { useMemo } from 'react';
import useSWR from 'swr';

interface OperatorMetricsResponse {
  total_revenue_pence: number;
  total_bookings: number;
  avg_booking_pence: number;
  operator_payout_pence: number;
  cancelled_count: number;
  scheduled_count: number;
  cached: boolean;
  timestamp: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch operator metrics');
  return res.json();
};

export function useOperatorMetrics(startDate?: string, endDate?: string) {
  const { user } = useCurrentUser();

  // Build API URL cu date params
  const apiUrl = useMemo(() => {
    if (!user || user.role !== 'operator') return null;

    const params = new URLSearchParams();
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    return `/api/dashboard/metrics?${params.toString()}`;
  }, [user, startDate, endDate]);

  const { data, error, isLoading, mutate } = useSWR<OperatorMetricsResponse>(apiUrl, fetcher, {
    refreshInterval: 60000, // Refresh every 60 seconds
    dedupingInterval: 30000, // Dedupe requests for 30 seconds
    revalidateOnFocus: false, // Don't revalidate on window focus
  });

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}
