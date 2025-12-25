/**
 * useResetPasswordForm Hook
 *
 * Handles password reset form logic after clicking email link.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export type ResetPasswordState = 'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'invalid_token';

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  passwordsMatch: boolean;
}

export interface UseResetPasswordFormReturn {
  state: ResetPasswordState;
  error: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  validation: PasswordValidation;
  isValid: boolean;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const MIN_PASSWORD_LENGTH = 8;

export function useResetPasswordForm(): UseResetPasswordFormReturn {
  const [state, setState] = useState<ResetPasswordState>('loading');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const supabase = createClient();

        console.log('[useResetPasswordForm] Starting token verification...');
        console.log('[useResetPasswordForm] URL:', window.location.href);

        // Get hash params from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        console.log('[useResetPasswordForm] Hash params:', { accessToken: accessToken?.substring(0, 20) + '...', type });

        // Check for recovery type
        if (type !== 'recovery' || !accessToken) {
          console.log('[useResetPasswordForm] Invalid type or missing token');
          setState('invalid_token');
          setError('Invalid or expired reset link. Please request a new one.');
          return;
        }

        // Check if user is already authenticated (token already verified by Supabase)
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[useResetPasswordForm] Current session:', session ? 'exists' : 'none');

        if (session) {
          console.log('[useResetPasswordForm] User already authenticated, ready to reset password');
          setState('ready');
          return;
        }

        // If no session, try to verify the token
        console.log('[useResetPasswordForm] Attempting to verify token with verifyOtp...');
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'recovery',
        });

        if (verifyError) {
          console.error('[useResetPasswordForm] verifyOtp error:', verifyError);
          setState('invalid_token');
          setError('Invalid or expired reset link. Please request a new one.');
          return;
        }

        console.log('[useResetPasswordForm] Token verified successfully');
        setState('ready');
      } catch (err) {
        console.error('[useResetPasswordForm] Verification exception:', err);
        setState('invalid_token');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyToken();
  }, []);

  // Password validation
  const validation = useMemo<PasswordValidation>(() => ({
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    passwordsMatch: password.length > 0 && password === confirmPassword,
  }), [password, confirmPassword]);

  const isValid = useMemo(() => {
    return (
      validation.minLength &&
      validation.hasUppercase &&
      validation.hasLowercase &&
      validation.hasNumber &&
      validation.passwordsMatch
    );
  }, [validation]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || state === 'submitting') return;

    setState('submitting');
    setError('');

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setState('error');
        setError(updateError.message);
        return;
      }

      // Sign out after password change for security
      await supabase.auth.signOut();

      setState('success');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  }, [isValid, state, password]);

  return {
    state,
    error,
    password,
    confirmPassword,
    showPassword,
    validation,
    isValid,
    handlePasswordChange,
    handleConfirmPasswordChange,
    toggleShowPassword,
    handleSubmit,
  };
}
