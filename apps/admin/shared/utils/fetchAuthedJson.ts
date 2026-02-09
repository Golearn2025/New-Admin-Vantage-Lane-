/**
 * Enterprise Auth Wrapper - Universal pentru toate API calls
 * 
 * Rezolvă problema clasică: UI logat dar API routes fără token
 * Standard enterprise: Authorization Bearer token explicit
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

// Supabase client pentru auth checks - folosește singleton
const supabase = createClient();

/**
 * Wait for session to be ready with retry logic
 */
async function waitForSession(maxRetries = 3, delayMs = 500): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logger.error(`Session error attempt ${attempt}/${maxRetries}`, { error: sessionError.message });
      if (attempt === maxRetries) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
      continue;
    }
    
    const token = session?.access_token;
    if (token) {
      logger.debug(`Session found on attempt ${attempt}/${maxRetries}`);
      return token;
    }
    
    if (attempt < maxRetries) {
      logger.warn(`No session token on attempt ${attempt}/${maxRetries}, retrying...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error('No session - please log in again');
}

/**
 * Authenticated fetch wrapper - trimite Bearer token la toate API calls
 * Fixes timing issue: waits for session to be ready with retry logic
 * 
 * @param url - API endpoint (ex: '/api/bookings/list?page=1')
 * @param options - Standard fetch options (method, body, etc.)
 * @returns Typed JSON response
 */
export async function fetchAuthedJson<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    // Wait for session with retry logic - fixes timing issue
    const token = await waitForSession();

    // Prepare headers with auth token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    logger.debug('Making authenticated API call', { 
      url, 
      method: options.method || 'GET',
      hasToken: !!token 
    });

    // Make authenticated request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-OK responses with detailed error
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      const errorMsg = `HTTP ${response.status} ${response.statusText}: ${errorText}`;
      
      logger.error('API call failed', { 
        url, 
        status: response.status, 
        statusText: response.statusText,
        errorText 
      });
      
      throw new Error(errorMsg);
    }

    // Parse and return JSON
    const data = await response.json() as T;
    
    logger.debug('API call successful', { 
      url, 
      status: response.status,
      dataType: typeof data 
    });
    
    return data;
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // Network errors (e.g. auth race condition) are transient — use warn, not error
    if (errMsg === 'Failed to fetch') {
      logger.warn('fetchAuthedJson network error (transient)', { url });
    } else {
      logger.error('fetchAuthedJson failed', { url, error: errMsg });
    }
    throw error;
  }
}

/**
 * Quick helpers for common HTTP methods
 */
export const authedFetch = {
  get: <T>(url: string) => fetchAuthedJson<T>(url, { method: 'GET' }),
  
  post: <T>(url: string, body: unknown) => 
    fetchAuthedJson<T>(url, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }),
    
  put: <T>(url: string, body: unknown) => 
    fetchAuthedJson<T>(url, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }),
    
  delete: <T>(url: string) => fetchAuthedJson<T>(url, { method: 'DELETE' }),
};
