/**
 * Server-side Role Detection
 * 
 * Replică aceeași logică din useCurrentUser.ts pentru determinarea rolurilor pe server
 * FĂRĂ să modifice logica existentă - doar o mută într-un context server-side
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

export type ServerRole = 'admin' | 'operator' | 'driver' | 'unknown';

/**
 * Determină rolul user-ului pe server bazat pe sesiune
 * Folosește aceeași logică din useCurrentUser.ts (liniile 47, 54-61)
 */
export async function getServerRole(request: NextRequest): Promise<ServerRole> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {
            // Nu modificăm cookies în această funcție read-only
          },
          remove() {
            // Nu modificăm cookies în această funcție read-only  
          },
        },
      }
    );

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    // Nu există sesiune sau eroare - user neautentificat
    if (sessionError || !user) {
      return 'unknown';
    }

    // Obține rolul din user metadata (exact ca în useCurrentUser.ts linia 47)
    const userRole = user.user_metadata?.role || 'operator';

    // Map role to AppShell role type (exact ca în useCurrentUser.ts liniile 54-61)
    if (userRole === 'admin' || userRole === 'super_admin') {
      return 'admin';
    } else if (userRole === 'driver') {
      return 'driver';
    } else {
      // fallback default (includă 'operator' și orice alte roluri necunoscute)
      return 'operator';
    }
  } catch (error) {
    console.error('Error determining server role:', error);
    return 'unknown';
  }
}

/**
 * Verifică dacă o rută necesită autentificare
 * Bazat pe isProtectedRoute din middleware.ts actual + rutele /driver/*
 */
export function requiresAuth(pathname: string): boolean {
  // Rutele care necesită autentificare (din middleware.ts actual + /driver/*)
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/refunds') ||
    pathname.startsWith('/disputes') ||
    pathname.startsWith('/payouts') ||
    pathname.startsWith('/documents') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/support-tickets') ||
    pathname.startsWith('/prices') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/project-health') ||
    pathname.startsWith('/audit-history') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/business-intelligence') ||
    pathname.startsWith('/reviews') ||
    pathname.startsWith('/driver') // ADĂUGAT: rutele driver acum sunt protejate
  ) && !pathname.startsWith('/ui-dashboard-demo'); // exclusie existentă din middleware
}

/**
 * Verifică dacă un rol are access la o anumită rută
 * Bazat pe EFFECTIVE_ACCESS_MATRIX.md
 */
export function isAllowed(pathname: string, role: ServerRole): boolean {
  // Utilizatori neautentificați nu au acces la rute protejate
  if (role === 'unknown') {
    return false;
  }

  // Rutele driver - DOAR pentru driver
  if (pathname.startsWith('/driver')) {
    return role === 'driver';
  }

  // Business Intelligence - NUMAI admin
  if (pathname.startsWith('/business-intelligence')) {
    return role === 'admin';
  }

  // Bookings - Admin ȘI Operator
  if (pathname.startsWith('/bookings')) {
    return role === 'admin' || role === 'operator';
  }

  // Users - logică detaliată
  if (pathname.startsWith('/users/drivers')) {
    // /users/drivers și /users/drivers/pending - Admin ȘI Operator  
    return role === 'admin' || role === 'operator';
  }
  if (pathname.startsWith('/users')) {
    // Orice alt /users/* (all, customers, operators, admins, assign-drivers, trash) - NUMAI Admin
    return role === 'admin';
  }

  // Documents - Admin ȘI Operator
  if (pathname.startsWith('/documents')) {
    return role === 'admin' || role === 'operator';
  }

  // Notifications - Admin ȘI Operator
  if (pathname.startsWith('/notifications')) {
    return role === 'admin' || role === 'operator';
  }

  // Support Tickets - Toți trei (Admin, Operator, Driver)
  if (pathname.startsWith('/support-tickets')) {
    return role === 'admin' || role === 'operator' || role === 'driver';
  }

  // Settings Profile - Admin ȘI Operator (profile settings pentru toți)
  if (pathname.startsWith('/settings/profile')) {
    return role === 'admin' || role === 'operator';
  }

  // Alte Settings - NUMAI Admin  
  if (pathname.startsWith('/settings')) {
    return role === 'admin';
  }

  // Rute specifice admin - NUMAI Admin
  if (
    pathname.startsWith('/reviews') ||
    pathname.startsWith('/prices') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/payouts') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/project-health') ||
    pathname.startsWith('/audit-history')
  ) {
    return role === 'admin';
  }

  // Dashboard - Toți trei pot intra (conform matricei)
  if (pathname.startsWith('/dashboard')) {
    return role === 'admin' || role === 'operator' || role === 'driver';
  }

  // Pentru orice altă rută care nu e în matrice, păstrăm comportamentul actual (access permis)
  return true;
}
