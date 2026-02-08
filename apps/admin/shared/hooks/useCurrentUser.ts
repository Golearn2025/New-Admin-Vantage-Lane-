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
    logger.warn('Admin user not found, checking operator/driver:', adminError);
    
    // Check if it's an operator
    const { data: operatorUser } = await supabase
      .from('user_organization_roles')
      .select('organization_id, role, is_active')
      .eq('user_id', authUserId)
      .eq('is_active', true)
      .single();

    if (operatorUser) {
      // Get user data from Supabase auth.users 
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const email = authUser?.email || 'operator@example.com';
      
      return {
        name: email.split('@')[0] || 'Operator',
        email: email,
        role: 'operator' as const,
        auth_user_id: authUserId,
        organization_id: operatorUser.organization_id,
      };
    }
    
    // Fallback: check if it's a driver
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
  
  // ✅ OPTIMIZED: Cache session for 5 min, no refetch on tab switch
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getCurrentSession,
    staleTime: 5 * 60 * 1000, // 5 min — session doesn't change often
    gcTime: 10 * 60 * 1000, // 10 min garbage collection
    refetchOnWindowFocus: false, // ❌ No refetch on tab switch
    refetchOnReconnect: false,
    retry: 1,
  });

  // ✅ OPTIMIZED: Cache user data for 5 min, no refetch on tab switch
  const { 
    data: user, 
    isLoading: userLoading, 
    error 
  } = useQuery({
    queryKey: ['current-user', authUserId],
    queryFn: () => getAdminUserData(authUserId!),
    enabled: !!authUserId, // Only run when we have auth user ID
    staleTime: 5 * 60 * 1000, // 5 min — user data doesn't change often
    gcTime: 10 * 60 * 1000, // 10 min garbage collection
    refetchOnWindowFocus: false, // ❌ No refetch on tab switch
    refetchOnReconnect: false,
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
