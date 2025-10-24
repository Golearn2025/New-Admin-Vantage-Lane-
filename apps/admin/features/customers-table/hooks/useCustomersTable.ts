/**
 * useCustomersTable Hook
 * 
 * Business logic and data fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { listCustomers } from '@entities/customer';
import type { CustomerData } from '@entities/customer';

export interface UseCustomersTableReturn {
  data: CustomerData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCustomersTable(): UseCustomersTableReturn {
  const [data, setData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customers = await listCustomers();
      setData(customers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { data, loading, error, refetch: fetchCustomers };
}
