/**
 * Supabase Server Client - Fleet Portal
 * Server-side client for SSR and Server Actions
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current operator ID from admin_users
 */
interface AdminUser {
  default_operator_id: string | null;
  role: string;
}

export async function getCurrentOperatorId(): Promise<string | null> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from('admin_users')
    .select('default_operator_id')
    .eq('auth_user_id', user.id)
    .single();

  const adminUser = data as AdminUser | null;
  return adminUser?.default_operator_id || null;
}

/**
 * Check if current user is operator
 */
export async function isOperator(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = createClient();
  const { data } = await supabase
    .from('admin_users')
    .select('role, default_operator_id')
    .eq('auth_user_id', user.id)
    .single();

  const adminUser = data as AdminUser | null;
  return adminUser?.role === 'operator' && !!adminUser?.default_operator_id;
}
