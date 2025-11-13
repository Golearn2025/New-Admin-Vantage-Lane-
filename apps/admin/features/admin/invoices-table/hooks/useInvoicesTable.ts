/**
 * useInvoicesTable Hook
 * Data fetching pentru invoices cu paginare
 * < 50 lines - RULES.md compliant
 */

'use client';

import { useState, useEffect } from 'react';
import { listInvoices } from '@entities/invoice';
import type { InvoiceListItem, InvoiceListRequest } from '@entities/invoice';

interface UseInvoicesTableProps {
  page: number;
  limit: number;
  status?: string;
}

export function useInvoicesTable({ page, limit, status }: UseInvoicesTableProps) {
  const [data, setData] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const filters: InvoiceListRequest = {
          page,
          limit,
          ...(status && { status: status as any })
        };
        
        const result = await listInvoices(filters);
        setData(result as any);
        setTotalCount(120); // Mock - replace with result.totalCount
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
