/**
 * useAdminsTable Hook
 * 
 * Business logic and data fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { listAdmins } from '@entities/admin';
import type { AdminData } from '@entities/admin';

export interface UseAdminsTableReturn {
  data: AdminData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminsTable(): UseAdminsTableReturn {
  const [data, setData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const admins = await listAdmins();
      setData(admins);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { data, loading, error, refetch: fetchAdmins };
}
