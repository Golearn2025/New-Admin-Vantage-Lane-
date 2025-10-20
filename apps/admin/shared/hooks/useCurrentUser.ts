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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get admin user details
        const { data: adminUser, error: userError } = await supabase
          .from('admin_users')
          .select('id, email, name, role, auth_user_id')
          .eq('auth_user_id', session.user.id)
          .single<AdminUser>();

        if (userError) throw userError;
        
        if (adminUser) {
          setUser({
            name: adminUser.name || adminUser.email,
            email: adminUser.email,
            role: adminUser.role === 'super_admin' || adminUser.role === 'admin' ? 'admin' : 'operator',
            auth_user_id: adminUser.auth_user_id,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        logger.error('Error fetching current user in useCurrentUser', { error: err instanceof Error ? err.message : String(err) });
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
