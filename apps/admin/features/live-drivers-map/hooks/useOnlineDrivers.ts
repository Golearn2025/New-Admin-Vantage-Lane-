/**
 * Live Drivers Map - useOnlineDrivers Hook
 * 
 * Manages fetching and real-time updates for online drivers
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { OnlineDriversResponse, MapFilters } from '@entities/driver-location';

interface UseOnlineDriversOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  filters?: MapFilters;
}

export function useOnlineDrivers(options: UseOnlineDriversOptions = {}) {
  const { 
    autoRefresh = true, 
    refreshInterval = 30000, // 30 seconds
    filters = { showOnline: true, showBusy: true }
  } = options;

  const [data, setData] = useState<OnlineDriversResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch online drivers from API
  const fetchDrivers = useCallback(async () => {
    try {
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.organizationId) {
        params.append('organizationId', filters.organizationId);
      }
      params.append('limit', '50');

      // Get session token for authenticated request
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No authentication session');
      }

      const response = await fetch(`/api/driver/live?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch drivers');
      }

      const result: OnlineDriversResponse = await response.json();
      
      // Apply client-side filters
      const filteredDrivers = result.drivers.filter(driver => {
        if (!filters.showOnline && driver.onlineStatus === 'online') return false;
        if (!filters.showBusy && driver.onlineStatus === 'busy') return false;
        return true;
      });

      const filteredResult = {
        ...result,
        drivers: filteredDrivers,
        totalCount: filteredDrivers.length,
      };

      setData(filteredResult);
      setLastUpdated(new Date());
      setLoading(false);

    } catch (err) {
      console.error('Error fetching online drivers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [filters]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true);
    return fetchDrivers();
  }, [fetchDrivers]);

  // Initial fetch
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchDrivers, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchDrivers]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    // Helper computed values
    drivers: data?.drivers || [],
    onlineCount: data?.onlineCount || 0,
    busyCount: data?.busyCount || 0,
    totalCount: data?.totalCount || 0,
  };
}
