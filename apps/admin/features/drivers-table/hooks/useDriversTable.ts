/**
 * useDriversTable Hook
 * 
 * Business logic and data fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { listDrivers } from '@entities/driver';
import type { DriverData } from '@entities/driver';

export interface UseDriversTableReturn {
  data: DriverData[];
  loading: boolean;
  error: string | null;
}

export function useDriversTable(): UseDriversTableReturn {
  const [data, setData] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        setError(null);
        const drivers = await listDrivers();
        setData(drivers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drivers');
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  return { data, loading, error };
}
