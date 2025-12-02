/**
 * Middleware - Auth & Role-Based Protection
 *
 * Protects routes based on EFFECTIVE_ACCESS_MATRIX.md
 * Prevents unauthorized access while maintaining UI visibility unchanged.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import './lib/config/env'; // Validate environment variables at startup
import { getServerRole, requiresAuth, isAllowed } from './apps/admin/lib/auth/server-role';

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

  // Check auth and role-based access for protected routes
  const pathname = request.nextUrl.pathname;
  
  if (requiresAuth(pathname)) {
    // Determină rolul user-ului curent
    const role = await getServerRole(request);
    
    // User neautentificat - redirect la login
    if (role === 'unknown') {
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // User autentificat dar fără acces la această rută - redirect la root
    if (!isAllowed(pathname, role)) {
      const redirectUrl = new URL('/', request.url);
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

      if (role === 'admin' || role === 'operator') {
        redirectPath = '/dashboard';
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
