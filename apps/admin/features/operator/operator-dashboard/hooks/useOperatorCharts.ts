/**
 * Operator Charts Hook
 *
 * Fetch chart data cu organization_id pentru operator.
 * Wrapper around dashboard charts cu filtrare automată.
 */

'use client';

import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import { useMemo } from 'react';
import useSWR from 'swr';

interface OperatorChartsResponse {
  weekly_activity: Array<{ x: string; y: number }>;
  revenue_trend: Array<{ x: string; y: number }>;
  status_distribution: Array<{ name: string; value: number }>;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch operator charts');
  return res.json();
};

export function useOperatorCharts(searchParams: URLSearchParams) {
  const { user } = useCurrentUser();

  // Build API URL cu params pentru operator
  const apiUrl = useMemo(() => {
    if (!user || user.role !== 'operator') return null;

    return `/api/dashboard/charts?${searchParams.toString()}`;
  }, [user, searchParams]);

  const { data, error, isLoading, mutate } = useSWR<OperatorChartsResponse>(apiUrl, fetcher, {
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
