/**
 * useLoginForm Hook
 * 
 * Centralized login form logic.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useCallback } from 'react';
import { signInWithPassword } from '@admin-shared/api/auth/actions';

export type LoginState = 'idle' | 'loading' | 'invalid_creds' | 'locked' | 'server_error';

export interface LoginError {
  type: LoginState;
  message: string;
  details?: string;
  retryIn?: number;
}

export interface UseLoginFormReturn {
  // Form state
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  state: LoginState;
  error: LoginError | null;
  isFormDisabled: boolean;

  // Handlers
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  handleRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleRetry: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [state, setState] = useState<LoginState>('idle');
  const [error, setError] = useState<LoginError | null>(null);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleRememberMeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state === 'loading') return;

    setState('loading');
    setError(null);

    try {
      // Create FormData from form
      const formData = new FormData(e.currentTarget);
      const emailValue = String(formData.get('email') || '');
      const passwordValue = String(formData.get('password') || '');
      const rememberValue = Boolean(formData.get('remember'));

      // Call server action
      const result = await signInWithPassword(emailValue, passwordValue, rememberValue);

      // Server action handles redirect on success
      // Only handle errors here
      if (result && !result.ok) {
        setState('invalid_creds');
        setError({
          type: 'invalid_creds',
          message: result.error || 'Authentication failed',
          details: 'Please check your credentials and try again.',
        });
      }
    } catch (err: unknown) {
      setState('server_error');
      setError({
        type: 'server_error',
        message: 'Service temporarily unavailable',
        details:
          (err instanceof Error ? err.message : 'Unknown error') ||
          'Please try again or contact support if the problem persists.',
      });
    }
  }, [state]);

  const handleRetry = useCallback(() => {
    setState('idle');
    setError(null);
    // Focus email input for retry
    setTimeout(() => {
      document.getElementById('email')?.focus();
    }, 0);
  }, []);

  const isFormDisabled = state === 'loading' || state === 'locked';

  return {
    email,
    password,
    showPassword,
    rememberMe,
    state,
    error,
    isFormDisabled,
    handleEmailChange,
    handlePasswordChange,
    toggleShowPassword,
    handleRememberMeChange,
    handleSubmit,
    handleRetry,
  };
}
