/**
 * useDeletedUsersTable Hook
 * Business logic for deleted users table
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UnifiedUser } from '@entities/user';
import { 
  listDeletedUsers, 
  restoreUsers, 
  hardDeleteUsers 
} from '@entities/user';

export function useDeletedUsersTable() {
  const [users, setUsers] = useState<UnifiedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await listDeletedUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load deleted users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  const handleRestore = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    const confirmRestore = window.confirm(
      `Are you sure you want to restore ${ids.length} user(s)? They will be visible again in the active users list.`
    );

    if (!confirmRestore) return;

    try {
      // Group by user type
      const usersByType = new Map<string, string[]>();
      
      ids.forEach(id => {
        const user = users.find(u => u.id === id);
        if (user) {
          const existing = usersByType.get(user.userType) || [];
          usersByType.set(user.userType, [...existing, id]);
        }
      });

      // Restore each group
      const entries = Array.from(usersByType.entries());
      for (const [userType, userIds] of entries) {
        await restoreUsers({ 
          userIds, 
          userType: userType as 'customer' | 'driver' | 'admin' | 'operator'
        });
      }

      // Reload data
      await loadUsers();
      
      alert(`Successfully restored ${ids.length} user(s)`);
    } catch (error) {
      console.error('Failed to restore users:', error);
      alert(`Failed to restore users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [users, loadUsers]);

  const handleHardDelete = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    const confirmDelete = window.confirm(
      `⚠️ WARNING: Are you sure you want to PERMANENTLY delete ${ids.length} user(s)?\n\n` +
      `This action CANNOT be undone! All data associated with these users will be lost forever.\n\n` +
      `Type YES to confirm permanent deletion.`
    );

    if (!confirmDelete) return;

    try {
      // Group by user type
      const usersByType = new Map<string, string[]>();
      
      ids.forEach(id => {
        const user = users.find(u => u.id === id);
        if (user) {
          const existing = usersByType.get(user.userType) || [];
          usersByType.set(user.userType, [...existing, id]);
        }
      });

      // Hard delete each group
      const entries = Array.from(usersByType.entries());
      for (const [userType, userIds] of entries) {
        await hardDeleteUsers({ 
          userIds, 
          userType: userType as 'customer' | 'driver' | 'admin' | 'operator'
        });
      }

      // Reload data
      await loadUsers();
      
      alert(`Permanently deleted ${ids.length} user(s)`);
    } catch (error) {
      console.error('Failed to hard delete users:', error);
      alert(`Failed to delete users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [users, loadUsers]);

  return {
    users,
    isLoading,
    handleRestore,
    handleHardDelete,
  };
}
