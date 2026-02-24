/**
 * Auth Server Actions
 *
 * Server-side authentication actions using Supabase.
 * Handles login, logout, and role-based redirects.
 */

'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supaServer } from '../clients/supabase';

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns Auth result with success/error and redirect
 */
export async function signInWithPassword(email: string, password: string, rememberMe?: boolean) {
  const cookieStore = cookies();
  const supabase = supaServer(cookieStore);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  const userId = data.user?.id;

  // Determine redirect based on admin_users table (authoritative source)
  // Falls back to user_metadata role if not found in admin_users
  let redirectTo = '/dashboard';

  if (userId) {
    try {
      const supabaseAdmin = createAdminClient();
      const { data: adminUser } = await supabaseAdmin
        .from('admin_users')
        .select('role')
        .eq('auth_user_id', userId)
        .single();

      if (adminUser) {
        // User is in admin_users → always go to dashboard
        redirectTo = '/dashboard';
      } else {
        // Not an admin — check user_metadata for role
        const metaRole = (data.user?.user_metadata?.role ?? 'operator') as string;
        if (metaRole === 'driver') {
          redirectTo = '/bookings';
        } else if (metaRole === 'operator') {
          redirectTo = '/operator';
        } else {
          redirectTo = '/dashboard';
        }
      }
    } catch {
      // If admin check fails, fall back to dashboard for safety
      redirectTo = '/dashboard';
    }
  }

  // Server-side redirect
  redirect(redirectTo);
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = supaServer(cookies());

  const { error } = await supabase.auth.signOut({ scope: 'global' });

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  // Redirect to login after successful logout
  redirect('/login');
}

/**
 * Sign out action for form actions (returns void)
 */
export async function signOutAction() {
  const supabase = supaServer(cookies());
  await supabase.auth.signOut({ scope: 'global' });

  // Force redirect to login and replace history
  redirect('/login');
}

/**
 * Get current user session (server-side)
 */
export async function getCurrentUser() {
  const supabase = supaServer(cookies());

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.user_metadata?.role ?? 'operator',
    name: session.user.user_metadata?.name,
  };
}

/**
 * Send password reset email
 * @param email - User email address
 * @returns Success/error result
 */
export async function resetPasswordForEmail(email: string) {
  const supabase = supaServer(cookies());

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  return {
    ok: true,
  };
}
