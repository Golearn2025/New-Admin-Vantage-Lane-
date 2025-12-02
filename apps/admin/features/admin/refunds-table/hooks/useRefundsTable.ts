/**
 * useRefundsTable Hook
 * Data fetching pentru refunds cu paginare
 * < 50 lines - RULES.md compliant
 */

'use client';

import { useState, useEffect } from 'react';
import { listRefunds } from '@entities/refund';
import type { RefundListItem, RefundListRequest } from '@entities/refund';

interface UseRefundsTableProps {
  page: number;
  limit: number;
  status?: string;
}

export function useRefundsTable({ page, limit, status }: UseRefundsTableProps) {
  const [data, setData] = useState<RefundListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const filters: RefundListRequest = {
          page,
          limit,
          ...(status && { status: status as 'pending' | 'succeeded' | 'failed' | 'cancelled' })
        };
        
        // TODO: Update when API returns { items, totalCount }
        const result = await listRefunds(filters);
        setData(result);
        setTotalCount(100); // Mock - replace with result.totalCount
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
