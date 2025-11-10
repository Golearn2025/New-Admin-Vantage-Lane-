/**
 * Supabase Admin Client
 * 
 * Server-side admin client with SERVICE_ROLE_KEY for admin operations
 * ONLY use in Server Actions and API Routes - NEVER expose to client!
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Create Supabase admin client with SERVICE_ROLE_KEY
 * Has full access to bypass RLS and use auth.admin API
 * 
 * WARNING: Only use in server-side code! Never expose to client!
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check .env.local:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
