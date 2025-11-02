/**
 * Supabase Server Client
 * 
 * Server-side Supabase client for API routes and server components
 * Re-exports from shared/api/clients/supabase
 */

import { cookies } from 'next/headers';
import { supaServer } from '@/shared/api/clients/supabase';

/**
 * Create Supabase server client
 * For use in API routes and server components
 */
export const createClient = () => {
  const cookieStore = cookies();
  return supaServer(cookieStore);
};
