/**
 * Documents Page - Driver Portal
 * 
 * Main documents management page. Server component for initial data fetch.
 */

import { redirect } from 'next/navigation';
import { createClient } from '../../../shared/lib/supabase/server';
import { DocumentsPageContent } from './DocumentsPageContent';

async function getCurrentDriver() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: driver } = await supabase
    .from('drivers')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!driver) {
    redirect('/login');
  }

  return driver.id;
}

export default async function DriverDocumentsPage() {
  const driverId = await getCurrentDriver();

  return <DocumentsPageContent driverId={driverId} />;
}
