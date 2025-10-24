/**
 * useOperatorsTable Hook
 * 
 * Business logic and data fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { listOperators } from '@entities/operator';
import type { OperatorData } from '@entities/operator';

export interface UseOperatorsTableReturn {
  data: OperatorData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOperatorsTable(): UseOperatorsTableReturn {
  const [data, setData] = useState<OperatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      const operators = await listOperators();
      setData(operators);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return { data, loading, error, refetch: fetchOperators };
}
