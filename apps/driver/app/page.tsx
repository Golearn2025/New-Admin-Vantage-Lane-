/**
 * Root Page - Driver Portal
 * Redirects to profile or login
 */

import { redirect } from 'next/navigation';
import { getCurrentDriver } from '@driver-shared/lib/supabase/server';

export default async function DriverRootPage() {
  const driver = await getCurrentDriver();

  if (!driver) {
    redirect('/login');
  }

  redirect('/profile');
}
