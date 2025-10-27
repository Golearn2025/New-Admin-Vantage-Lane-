/**
 * useCurrentDriver Hook
 * 
 * Get current authenticated driver's ID.
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../shared/lib/supabase/client';

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UseCurrentDriverReturn {
  driverId: string | null;
  driver: Driver | null;
  loading: boolean;
  error: string | null;
}

export function useCurrentDriver(): UseCurrentDriverReturn {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDriver() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error('Not authenticated');
        }

        // Get driver record
        const { data, error: driverError } = await supabase
          .from('drivers')
          .select('id, first_name, last_name, email')
          .eq('auth_user_id', user.id)
          .single();

        if (driverError) {
          throw new Error('Driver not found');
        }

        setDriverId(data.id);
        setDriver(data as Driver);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch driver');
      } finally {
        setLoading(false);
      }
    }

    fetchDriver();
  }, []);

  return { driverId, driver, loading, error };
}
