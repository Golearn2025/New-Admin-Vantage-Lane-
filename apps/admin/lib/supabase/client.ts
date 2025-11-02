/**
 * Supabase Client Wrapper
 * 
 * Backwards compatible wrapper pentru entity APIs
 * Re-exports from shared/api/clients/supabase
 */

import { supaBrowser } from '@/shared/api/clients/supabase';

/**
 * Create Supabase client (browser)
 * Alias pentru supaBrowser() pentru backwards compatibility
 */
export const createClient = supaBrowser;
