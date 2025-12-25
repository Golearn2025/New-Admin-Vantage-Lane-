/**
 * useConfirmEmail Hook
 *
 * Handles email confirmation token verification.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type ConfirmState = 'loading' | 'success' | 'error' | 'expired';

export interface UseConfirmEmailReturn {
  state: ConfirmState;
  error: string;
  userEmail: string | null;
}

export function useConfirmEmail(): UseConfirmEmailReturn {
  const [state, setState] = useState<ConfirmState>('loading');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createClient();

        // Get hash params from URL (Supabase sends tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Also check query params (some flows use query string)
        const queryParams = new URLSearchParams(window.location.search);
        const tokenHash = queryParams.get('token_hash');
        const queryType = queryParams.get('type');

        // Handle PKCE flow with token_hash
        if (tokenHash && queryType === 'email') {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (verifyError) {
            setState('error');
            setError(verifyError.message);
            return;
          }

          if (data.user?.email) {
            setUserEmail(data.user.email);
          }
          setState('success');
          return;
        }

        // Handle implicit flow with access_token
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setState('error');
            setError(sessionError.message);
            return;
          }

          if (data.user?.email) {
            setUserEmail(data.user.email);
          }
          setState('success');
          return;
        }

        // No valid tokens found
        setState('error');
        setError('Invalid or missing confirmation link. Please request a new one.');
      } catch (err) {
        setState('error');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, []);

  return {
    state,
    error,
    userEmail,
  };
}
