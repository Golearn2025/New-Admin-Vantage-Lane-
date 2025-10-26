/**
 * usePermissionMenu Hook
 * Dynamically loads menu based on user permissions from database
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NavMenuItem, UserRole } from './types';
import { getMenuForRole } from './menu-config';

interface PermissionMenuResult {
  menu: NavMenuItem[];
  loading: boolean;
  error: Error | null;
}

/**
 * Get menu items filtered by user permissions
 * Falls back to role-based menu if permissions not available
 */
export function usePermissionMenu(
  userId: string | undefined,
  userRole: UserRole
): PermissionMenuResult {
  const [menu, setMenu] = useState<NavMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      // No user, use default role menu
      setMenu(getMenuForRole(userRole));
      setLoading(false);
      return;
    }

    const loadPermissions = async () => {
      try {
        const supabase = createClient();

        // Get user permissions (with role fallback)
        const { data, error: permError } = await supabase.rpc('get_user_menu_permissions', {
          p_user_id: userId,
          p_role: userRole,
        });

        if (permError) {
          console.warn('Failed to load permissions, using role defaults:', permError);
          setMenu(getMenuForRole(userRole));
          setLoading(false);
          return;
        }

        // Build menu from permissions
        const enabledPages = new Set(data?.map((p: any) => p.page_key) || []);
        const roleMenu = getMenuForRole(userRole);

        // Filter menu based on permissions
        const filteredMenu = roleMenu.filter((item) => {
          const pageKey = item.href.replace(/^\//, '').replace(/\//g, '-');
          return enabledPages.has(pageKey) || enabledPages.has(item.href);
        });

        setMenu(filteredMenu);
      } catch (err) {
        console.error('Error loading menu permissions:', err);
        setError(err instanceof Error ? err : new Error('Failed to load permissions'));
        // Fallback to role menu
        setMenu(getMenuForRole(userRole));
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [userId, userRole]);

  return { menu, loading, error };
}
