'use client';

/**
 * Payouts List Hook
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Payout } from '../types';

export function usePayoutsList() {
  const [data, setData] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: legs, error: dbError } = await supabase
          .from('booking_legs')
          .select(`
            *,
            assigned_driver_id,
            drivers!inner(
              first_name,
              last_name
            )
          `)
          .not('driver_payout', 'is', null)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        // Transform to Payout format
        const payouts: Payout[] = (legs || []).map((leg: any) => ({
          id: leg.id,
          driverId: leg.assigned_driver_id,
          driverName: leg.drivers
            ? `${leg.drivers.first_name} ${leg.drivers.last_name}`.trim()
            : 'Unknown Driver',
          amount: Math.round(Number(leg.driver_payout || 0) * 100), // Convert to pence
          status: leg.payout_status as 'pending' | 'processing' | 'completed' | 'failed',
          createdAt: leg.created_at,
        }));

        setData(payouts);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
