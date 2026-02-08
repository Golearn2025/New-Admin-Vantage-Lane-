'use client';

/**
 * Payouts List Hook
 */

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { Payout } from '../types';

interface LegData {
  id: string;
  assigned_driver_id: string;
  driver_payout: number | null;
  payout_status: string;
  created_at: string;
  drivers?: {
    first_name: string;
    last_name: string;
  };
  bookings?: {
    pickup_datetime: string;
    pickup_location: string;
    dropoff_location: string;
  };
}

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
            id,
            assigned_driver_id,
            driver_payout,
            payout_status,
            created_at,
            drivers!inner(
              first_name,
              last_name
            )
          `)
          .not('driver_payout', 'is', null)
          .order('created_at', { ascending: false })
          .limit(200);

        if (dbError) throw dbError;

        // Transform to Payout format
        const payouts: Payout[] = (legs || []).map((leg: any) => {
          const driver = Array.isArray(leg.drivers) ? leg.drivers[0] : leg.drivers;
          return {
            id: leg.id,
            driverId: leg.assigned_driver_id,
            driverName: driver
              ? `${driver.first_name} ${driver.last_name}`.trim()
              : 'Unknown Driver',
            amount: Math.round(Number(leg.driver_payout || 0) * 100), // Convert to pence
            status: leg.payout_status as 'pending' | 'processing' | 'completed' | 'failed',
            createdAt: leg.created_at,
          };
        });

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
