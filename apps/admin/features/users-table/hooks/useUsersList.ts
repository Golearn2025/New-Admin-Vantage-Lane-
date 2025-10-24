'use client';

/**
 * Users List Hook
 */

import { useEffect, useState } from 'react';
import { listUsers } from '@entities/user';
import type { User } from '@entities/user';

export function useUsersList() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await listUsers();
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
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}
