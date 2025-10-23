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

  useEffect(() => {
    (async () => {
      try {
        const users = await listUsers();
        setData(users);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
