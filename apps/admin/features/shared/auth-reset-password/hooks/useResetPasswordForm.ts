/**
 * useResetPasswordForm Hook
 *
 * Handles password reset form logic after clicking email link.
 * Zero logic in UI component - all state management here.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
        const supabase = createClientComponentClient();

        // Get hash params from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Check for recovery type
        if (type !== 'recovery' && !accessToken) {
          // Also check query params for PKCE flow
          const queryParams = new URLSearchParams(window.location.search);
          const tokenHash = queryParams.get('token_hash');
          const queryType = queryParams.get('type');

          if (tokenHash && queryType === 'recovery') {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery',
            });

            if (verifyError) {
              setState('invalid_token');
              setError('Invalid or expired reset link. Please request a new one.');
              return;
            }

            setState('ready');
            return;
          }

          setState('invalid_token');
          setError('Invalid or expired reset link. Please request a new one.');
          return;
        }

        // Set session from tokens
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setState('invalid_token');
            setError('Invalid or expired reset link. Please request a new one.');
            return;
          }
        }

        setState('ready');
      } catch (err) {
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
      const supabase = createClientComponentClient();

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
