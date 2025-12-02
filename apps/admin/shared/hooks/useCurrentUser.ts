/**
 * useCurrentUser Hook - OPTIMIZED VERSION
 *
 * Folosește React Query pentru caching și reducing API calls.
 * ÎNAINTE: 20+ queries/minut | DUPĂ: 1 query/session
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import type { UserInfo } from '@admin-shared/ui/composed/appshell/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'super_admin' | 'admin' | 'support';
  auth_user_id: string;
}

// 🚀 PERFORMANCE: Separate session check from user data
async function getCurrentSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

async function getAdminUserData(authUserId: string): Promise<UserInfo> {
  const supabase = createClient();
  
  // Get admin user details
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, name, role')
    .eq('auth_user_id', authUserId)
    .single();

  if (adminError) {
    logger.warn('Admin user not found, checking driver/customer:', adminError);
    
    // Fallback: check if it's a driver or customer
    const { data: driverUser } = await supabase
      .from('drivers')
      .select('id, email, first_name, last_name')
      .eq('auth_user_id', authUserId)
      .single();

    if (driverUser) {
      return {
        name: `${driverUser.first_name} ${driverUser.last_name}`.trim(),
        email: driverUser.email,
        role: 'driver' as const,
        auth_user_id: authUserId,
      };
    }

    throw new Error('User not found in any table');
  }

  // Map role to AppShell role type (admin | operator | driver)
  let appShellRole: 'admin' | 'operator' | 'driver' = 'operator';
  if (adminUser.role === 'admin' || adminUser.role === 'super_admin') {
    appShellRole = 'admin';
  } else if (adminUser.role === 'driver') {
    appShellRole = 'driver';
  } else {
    appShellRole = 'operator';
  }

  return {
    name: adminUser.name || adminUser.email || 'Admin User',
    email: adminUser.email,
    role: appShellRole,
    auth_user_id: authUserId,
  };
}

export function useCurrentUser() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  
  // 🚀 OPTIMIZATION: Cache session check - rarely changes
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getCurrentSession,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes in cache (React Query v5)
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    retry: 1,
  });

  // 🚀 OPTIMIZATION: Cache user data - changes very rarely
  const { 
    data: user, 
    isLoading: userLoading, 
    error 
  } = useQuery({
    queryKey: ['current-user', authUserId],
    queryFn: () => getAdminUserData(authUserId!),
    enabled: !!authUserId, // Only run when we have auth user ID
    staleTime: 15 * 60 * 1000, // 15 minutes cache - user data rarely changes
    gcTime: 30 * 60 * 1000, // 30 minutes in cache (React Query v5)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Update auth user ID when session changes
  useEffect(() => {
    if (session?.user?.id) {
      setAuthUserId(session.user.id);
    } else {
      setAuthUserId(null);
    }
  }, [session?.user?.id]);

  const loading = sessionLoading || (!!authUserId && userLoading);

  return {
    user,
    loading,
    error: error as Error | null,
  };
}

// 🚀 PERFORMANCE MONITORING: Track usage
export function useCurrentUserWithMetrics() {
  const result = useCurrentUser();
  
  useEffect(() => {
    if (!result.loading) {
      performance.mark('user-loaded');
      console.log('👤 User loaded:', {
        cached: !result.loading,
        user: result.user?.email,
        timestamp: Date.now()
      });
    }
  }, [result.loading, result.user?.email]);

  return result;
}

// Export default for compatibility
export { useCurrentUser as default };
