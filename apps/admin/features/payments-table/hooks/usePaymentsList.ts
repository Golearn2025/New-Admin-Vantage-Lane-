'use client';

/**
 * Payments List Hook
 */

import { useEffect, useState } from 'react';
import { listPayments } from '@entities/payment';
import type { Payment } from '@entities/payment';

export function usePaymentsList() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const payments = await listPayments();
        setData(payments);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
