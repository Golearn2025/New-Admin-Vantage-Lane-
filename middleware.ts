/**
 * Middleware - Auth Guard
 *
 * Protects all admin routes. Redirects unauthenticated users to /login.
 * Uses Supabase SSR session check with timeout protection.
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/forgot-password',
  '/auth/confirm',
  '/auth/reset-password',
  '/api/health',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths and static assets
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Create response to allow cookie mutation
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Create Supabase SSR client in middleware context
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Check session — getUser() is more secure than getSession()
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Not authenticated → redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the original destination for post-login redirect
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated → allow through
    return response;
  } catch (error) {
    // On network timeout or Supabase unreachable: fail open for API routes,
    // redirect to login for page routes to avoid showing broken dashboard
    console.error('[Middleware] Auth check failed:', error);

    if (pathname.startsWith('/api/')) {
      // API routes: let them handle auth themselves
      return response;
    }

    // Page routes: redirect to login on error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_unavailable');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
