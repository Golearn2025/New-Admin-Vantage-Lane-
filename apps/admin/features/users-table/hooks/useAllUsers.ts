/**
 * useAllUsers Hook
 * 
 * Fetches all users from DB (customers, drivers, admins, operators)
 * Returns unified structure with common fields
 */

'use client';

import { useEffect, useState } from 'react';
import { listAllUsers } from '@entities/user';
import type { UnifiedUser } from '@entities/user';

export interface UseAllUsersReturn {
  data: UnifiedUser[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all users
 */
export function useAllUsers(): UseAllUsersReturn {
  const [data, setData] = useState<UnifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await listAllUsers();
      setData(users);
      setError(undefined);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchUsers,
  };
}
