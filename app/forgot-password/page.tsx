/**
 * Forgot Password Page - Supabase Authentication
 *
 * Handles password reset requests.
 * - Email input with validation
 * - Sends reset link via Supabase
 * - Success state with instructions
 * - Back to login link
 */

'use client';

import { useState } from 'react';
import {
  BrandBackground,
  AuthCard,
  FormRow,
  Button,
  ErrorBanner,
} from '@vantage-lane/ui-core';
import { resetPasswordForEmail } from '@admin-shared/api/auth/actions';
import styles from './forgot-password.module.css';

type ResetState = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ResetState>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const isFormDisabled = state === 'loading';

  // Success state
  if (state === 'success') {
    return (
      <BrandBackground variant="login">
        <main className={styles['page']}>
          <AuthCard title="Check your email">
            <div className={styles['success']}>
              <div className={styles['successIcon']}>✓</div>
              <p className={styles['successMessage']}>
                We&apos;ve sent a password reset link to:
              </p>
              <strong className={styles['email']}>{email}</strong>
              <p className={styles['instructions']}>
                Please check your inbox and follow the instructions to reset your
                password.
              </p>
              <p className={styles['note']}>
                Didn&apos;t receive the email? Check your spam folder or try again in a few
                minutes.
              </p>
              <a href="/login" className={styles['backButton']}>
                Back to login
              </a>
            </div>
          </AuthCard>
        </main>
      </BrandBackground>
    );
  }

  // Form state
  return (
    <BrandBackground variant="login">
      <main className={styles['page']}>
        <AuthCard title="Reset Password">
          <div className={styles['description']}>
            <p>
              Enter your email address and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          {error && (
            <ErrorBanner
              type="error"
              message={error}
              details="Please check your email address and try again."
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <fieldset className={styles['fieldset']} disabled={isFormDisabled}>
              <FormRow
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
                autoComplete="username"
                autoFocus={true}
                placeholder="admin@test.com"
                disabled={isFormDisabled}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={state === 'loading'}
                disabled={isFormDisabled || !email}
                className={styles['submitButton']}
              >
                {state === 'loading' ? 'Sending...' : 'Send reset link'}
              </Button>

              <div className={styles['footer']}>
                <a
                  href="/login"
                  className={styles['backLink']}
                  tabIndex={isFormDisabled ? -1 : 0}
                >
                  ← Back to login
                </a>
              </div>
            </fieldset>
          </form>
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
