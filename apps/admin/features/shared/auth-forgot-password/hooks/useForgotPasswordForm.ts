/**
 * useForgotPasswordForm Hook
 * 
 * Centralized forgot password form logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useCallback } from 'react';
import { resetPasswordForEmail } from '@admin-shared/api/auth/actions';

export type ResetState = 'idle' | 'loading' | 'success' | 'error';

export interface UseForgotPasswordFormReturn {
  // Form state
  email: string;
  state: ResetState;
  error: string;
  isFormDisabled: boolean;

  // Handlers
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ResetState>('idle');
  const [error, setError] = useState('');

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state === 'loading') return;

    setState('loading');
    setError('');

    try {
      const result = await resetPasswordForEmail(email);

      if (result.ok) {
        setState('success');
      } else {
        setState('error');
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err: unknown) {
      setState('error');
      setError(
        err instanceof Error
          ? err.message
          : 'Service temporarily unavailable. Please try again later.'
      );
    }
  }, [state, email]);

  const isFormDisabled = state === 'loading';

  return {
    email,
    state,
    error,
    isFormDisabled,
    handleEmailChange,
    handleSubmit,
  };
}
