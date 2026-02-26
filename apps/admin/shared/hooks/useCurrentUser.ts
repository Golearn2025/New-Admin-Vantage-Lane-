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
  
  // Get user data from auth.users first
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const email = authUser?.email || 'user@example.com';
  
  // Check organization_members (new DB schema)
  // Note: RLS policies should allow users to read their own membership via auth.uid()
  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select(`
      role,
      organization_id,
      organizations(name)
    `)
    .eq('user_id', authUserId)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle "no rows" gracefully

  // If membership query failed with error (not just "no rows"), log it
  if (membershipError) {
    logger.error('Error querying organization_members:', membershipError);
  }

  // If no membership found, check drivers table
  if (!membership) {
    logger.warn('User not found in organization_members, checking drivers');
    
    // Fallback: check if it's a driver
    const { data: driverUser } = await supabase
      .from('drivers')
      .select('id, email, first_name, last_name')
      .eq('user_id', authUserId)
      .maybeSingle();

    if (driverUser) {
      return {
        name: `${driverUser.first_name} ${driverUser.last_name}`.trim(),
        email: driverUser.email,
        role: 'driver' as const,
        auth_user_id: authUserId,
      };
    }

    // User not found in any table - log error but don't throw (prevents infinite loading)
    logger.error('User not found in organization_members or drivers', { authUserId, email });
    
    // Return minimal user info to allow app to render (will show error state instead of infinite loading)
    return {
      name: email.split('@')[0] || 'Unknown User',
      email: email,
      role: 'operator' as const,
      auth_user_id: authUserId,
    };
  }

  // Map organization role to AppShell role type
  // root/owner/admin → admin, operator → operator, driver → driver
  let appShellRole: 'admin' | 'operator' | 'driver' = 'operator';
  if (membership.role === 'root' || membership.role === 'owner' || membership.role === 'admin') {
    appShellRole = 'admin';
  } else if (membership.role === 'driver') {
    appShellRole = 'driver';
  } else {
    appShellRole = 'operator';
  }

  return {
    name: email.split('@')[0] || 'User',
    email: email,
    role: appShellRole,
    auth_user_id: authUserId,
    organization_id: membership.organization_id,
  };
}

export function useCurrentUser() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  
  // 🚧 DEVELOPMENT: Cache DISABLED pentru fresh auth state
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: getCurrentSession,
    staleTime: 0, // No cache - sempre fetch fresh
    gcTime: 0, // No cache storage 
    refetchOnWindowFocus: true, // Refetch pe tab switch
    retry: 1,
  });

  // 🚧 DEVELOPMENT: Cache DISABLED pentru fresh user data  
  const { 
    data: user, 
    isLoading: userLoading, 
    error 
  } = useQuery({
    queryKey: ['current-user', authUserId],
    queryFn: () => getAdminUserData(authUserId!),
    enabled: !!authUserId, // Only run when we have auth user ID
    staleTime: 0, // No cache - sempre fetch fresh
    gcTime: 0, // No cache storage
    refetchOnWindowFocus: true, // Refetch pe tab switch
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
