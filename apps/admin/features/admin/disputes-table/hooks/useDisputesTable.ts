/**
 * useDisputesTable Hook
 * Data fetching pentru disputes cu paginare
 * < 50 lines - RULES.md compliant
 */

'use client';

import { useState, useEffect } from 'react';
import { listDisputes } from '@entities/dispute';
import type { DisputeListItem, DisputeListRequest } from '@entities/dispute';

interface UseDisputesTableProps {
  page: number;
  limit: number;
  status?: string;
}

export function useDisputesTable({ page, limit, status }: UseDisputesTableProps) {
  const [data, setData] = useState<DisputeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const filters: DisputeListRequest = {
          page,
          limit,
          ...(status && { status: status as any })
        };
        
        const result = await listDisputes(filters);
        setData(result as any);
        setTotalCount(75); // Mock - replace with result.totalCount
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, limit, status]);

  return { data, loading, error, totalCount };
}
