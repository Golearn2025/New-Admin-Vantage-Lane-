/**
 * Supabase Client Configuration
 * 
 * Browser and Server clients for Supabase auth and database operations.
 * Uses environment variables from .env.local
 */

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Browser client for client-side operations
 */
export const supaBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

/**
 * Server client for server-side operations (server actions, middleware)
 * @param cookieStore - Next.js cookies store
 */
export const supaServer = (cookieStore: ReadonlyRequestCookies) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        }
      }
    }
  );
