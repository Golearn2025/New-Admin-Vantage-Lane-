/**
 * Root Page - Fleet Portal
 * Redirects to dashboard or login
 */

import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentOperatorId } from '../shared/lib/supabase/server';

export default async function FleetRootPage() {
  const user = await getCurrentUser();
  const operatorId = await getCurrentOperatorId();

  if (!user || !operatorId) {
    redirect('/login');
  }

  redirect('/dashboard');
}
