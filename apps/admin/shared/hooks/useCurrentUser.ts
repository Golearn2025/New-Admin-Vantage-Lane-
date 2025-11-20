/**
 * useCurrentUser Hook
 *
 * Citește user-ul curent autentificat și detaliile din admin_users.
 * Client-side hook pentru AppShell și components.
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import type { UserInfo } from '@admin-shared/ui/composed/appshell/types';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'super_admin' | 'admin' | 'support';
  auth_user_id: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get role from user metadata (stored in Supabase auth)
        const userRole = session.user.user_metadata?.role || 'operator';
        const firstName = session.user.user_metadata?.first_name;
        const lastName = session.user.user_metadata?.last_name;
        const userName = firstName && lastName ? `${firstName} ${lastName}` : session.user.email?.split('@')[0];

        // Map role to AppShell role type (admin | operator | driver)
        let appShellRole: 'admin' | 'operator' | 'driver' = 'operator';
        if (userRole === 'admin' || userRole === 'super_admin') {
          appShellRole = 'admin';
        } else if (userRole === 'driver') {
          appShellRole = 'driver';
        } else {
          appShellRole = 'operator';
        }

        const userInfo = {
          name: userName || session.user.email || 'User',
          email: session.user.email || '',
          role: appShellRole,
          auth_user_id: session.user.id,
        };
        
        console.log('🔍 USER DEBUG: Setting user info for role:', userRole, userInfo);
        
        setUser(userInfo);
      } catch (err) {
        logger.error('Error fetching current user in useCurrentUser', {
          error: err instanceof Error ? err.message : String(err),
        });
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
