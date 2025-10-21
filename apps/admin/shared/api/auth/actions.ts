/**
 * Auth Server Actions
 *
 * Server-side authentication actions using Supabase.
 * Handles login, logout, and role-based redirects.
 */

'use server';

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
  const supabase = supaServer(cookies());

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Set session persistence based on remember me
  if (data.session && rememberMe) {
    // Set longer session cookies for remember me (30 days)
    cookies().set('sb-access-token', data.session.access_token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    cookies().set('sb-refresh-token', data.session.refresh_token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  // Extract role from user metadata (default to 'operator')
  const role = (data.user?.user_metadata?.role ?? 'operator') as
    | 'admin'
    | 'operator'
    | 'driver'
    | 'customer'
    | 'auditor';

  // Role-based redirects
  let redirectTo: string;

  switch (role) {
    case 'admin':
      redirectTo = '/dashboard';
      break;
    case 'operator':
      redirectTo = '/bookings/active';
      break;
    case 'driver':
      redirectTo = '/bookings';
      break;
    case 'customer':
      redirectTo = '/bookings';
      break;
    case 'auditor':
      redirectTo = '/audit-history';
      break;
    default:
      redirectTo = '/bookings';
  }

  // Server-side redirect
  redirect(redirectTo);
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = supaServer(cookies());

  const { error } = await supabase.auth.signOut();

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
  await supabase.auth.signOut();

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
