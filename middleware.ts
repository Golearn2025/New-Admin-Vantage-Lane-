/**
 * Middleware - Auth Protection
 *
 * Protects admin routes și prevents back button after logout.
 * Redirect to login for unauthenticated users.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import './lib/config/env'; // Validate environment variables at startup

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Check auth for protected routes
  // TEMPORARY: /operator and /driver are NOT protected (for development)
  const isProtectedRoute =
    (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/bookings') ||
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/payments') ||
      request.nextUrl.pathname.startsWith('/invoices') ||
      request.nextUrl.pathname.startsWith('/refunds') ||
      request.nextUrl.pathname.startsWith('/disputes') ||
      request.nextUrl.pathname.startsWith('/payouts') ||
      request.nextUrl.pathname.startsWith('/documents') ||
      request.nextUrl.pathname.startsWith('/notifications') ||
      request.nextUrl.pathname.startsWith('/support-tickets') ||
      request.nextUrl.pathname.startsWith('/prices') ||
      request.nextUrl.pathname.startsWith('/monitoring') ||
      request.nextUrl.pathname.startsWith('/project-health') ||
      request.nextUrl.pathname.startsWith('/audit-history') ||
      request.nextUrl.pathname.startsWith('/settings')) &&
    !request.nextUrl.pathname.startsWith('/ui-dashboard-demo');

  if (isProtectedRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // No user found, redirect to login
    if (!user) {
      // Use replace to prevent back button issues
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If user is authenticated and tries to access login, redirect based on role
  if (request.nextUrl.pathname === '/login') {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const role = user.user_metadata?.role ?? 'operator';
      let redirectPath = '/dashboard';

      if (role === 'admin') {
        redirectPath = '/dashboard';
      } else if (role === 'operator') {
        redirectPath = '/operator/dashboard';
      } else if (role === 'driver') {
        redirectPath = '/driver/dashboard';
      }

      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
