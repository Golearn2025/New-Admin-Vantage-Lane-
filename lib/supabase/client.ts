/**
 * Supabase Client - Browser
 *
 * Client-side Supabase pentru use în React components.
 * Uses createBrowserClient pentru client-side rendering.
 */

'use client';

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
