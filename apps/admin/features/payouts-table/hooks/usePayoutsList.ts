'use client';

/**
 * Payouts List Hook
 */

import { useEffect, useState } from 'react';
import type { Payout } from '../types';

export function usePayoutsList() {
  const [data, setData] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      try {
        // TODO: Replace with real API call
        setData([]);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
