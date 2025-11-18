/**
 * Supabase Admin Client
 * 
 * Server-side admin client with SERVICE_ROLE_KEY for admin operations
 * ONLY use in Server Actions and API Routes - NEVER expose to client!
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';

/**
 * Create Supabase admin client with SERVICE_ROLE_KEY
 * Has full access to bypass RLS and use auth.admin API
 * 
 * WARNING: Only use in server-side code! Never expose to client!
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Debug logging for production
  logger.info('Admin client environment check', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceRoleKey,
    urlPrefix: supabaseUrl?.substring(0, 20),
    serviceKeyPrefix: supabaseServiceRoleKey?.substring(0, 20)
  });

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const errorMsg = `Missing Supabase environment variables:
    - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'SET' : 'MISSING'}
    - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? 'SET' : 'MISSING'}`;
    logger.error('Admin client initialization failed', errorMsg);
    throw new Error(errorMsg);
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
