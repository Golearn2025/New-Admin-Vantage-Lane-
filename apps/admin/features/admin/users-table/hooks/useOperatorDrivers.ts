/**
 * useOperatorDrivers Hook
 *
 * Fetches drivers assigned to current operator's organization
 * Returns filtered drivers for RBAC permission control
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import type { UnifiedUser } from '@entities/user';
import { useEffect, useState } from 'react';

export interface UseOperatorDriversReturn {
  data: UnifiedUser[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch drivers assigned to operator's organization
 */
export function useOperatorDrivers(): UseOperatorDriversReturn {
  const [data, setData] = useState<UnifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const { user } = useCurrentUser();

  const fetchOperatorDrivers = async () => {
    if (!user?.organization_id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      // Query drivers assigned to operator's organization via drivers.organization_id
      const { data: drivers, error: driversError } = await supabase
        .from('drivers')
        .select('id, email, first_name, last_name, phone, is_active, created_at')
        .eq('organization_id', user.organization_id)
        .is('deleted_at', null);

      if (driversError) throw driversError;

      // Map to UnifiedUser format
      const driversUnified: UnifiedUser[] = (drivers || []).map((driver) => ({
        id: driver.id,
        userType: 'driver' as const,
        name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'No Name',
        email: driver.email || 'no-email@example.com',
        phone: driver.phone,
        status: driver.is_active ? 'active' : 'inactive',
        createdAt: driver.created_at,
      }));

      // Sort by created_at descending (newest first)
      driversUnified.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setData(driversUnified);
      setError(undefined);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperatorDrivers();
  }, [user?.organization_id]);

  return {
    data,
    loading,
    error,
    refetch: fetchOperatorDrivers,
  };
}
