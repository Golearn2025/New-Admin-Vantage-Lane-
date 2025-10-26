/**
 * Login Page - Driver Portal
 *
 * Implements Supabase auth with server actions.
 * - Responsive xs-xl cu card centrat
 * - Brand colors și logo
 * - A11y compliance (WCAG 2.1 AA)
 * - Driver-scoped access
 * - Zero fetch în UI - doar server actions
 */

'use client';

import { useState } from 'react';
import { BrandBackground } from '../_ui/BrandBackground';
import { AuthCard } from '../_ui/AuthCard';
import { FormRow } from '../_ui/FormRow';
import { ErrorBanner } from '../_ui/ErrorBanner';
import { Button } from '../_ui/Button';
import { Checkbox } from '../_ui/Checkbox';
import { signInWithPassword } from '../../shared/api/auth/actions';
import styles from './login.module.css';

type LoginState = 'idle' | 'loading' | 'invalid_creds' | 'locked' | 'server_error';

interface LoginError {
  type: LoginState;
  message: string;
  details?: string;
  retryIn?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [state, setState] = useState<LoginState>('idle');
  const [error, setError] = useState<LoginError | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state === 'loading') return;

    setState('loading');
    setError(null);

    try {
      // Create FormData from form
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');
      const remember = Boolean(formData.get('remember'));

      // Call server action
      const result = await signInWithPassword(email, password, remember);

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
  };

  const handleRetry = () => {
    setState('idle');
    setError(null);
    // Focus email input for retry
    document.getElementById('email')?.focus();
  };

  const isFormDisabled = state === 'loading' || state === 'locked';

  return (
    <BrandBackground variant="login">
      <main className={styles['page']}>
        <AuthCard title="Sign In" subtitle="Driver Access">
          {error && (
            <ErrorBanner
              type={
                error.type === 'invalid_creds'
                  ? 'error'
                  : error.type === 'server_error'
                    ? 'error'
                    : 'warning'
              }
              message={error.message}
              {...(error.details && { details: error.details })}
              {...(error.type === 'server_error' && {
                actionLabel: 'Retry',
                onAction: handleRetry,
              })}
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

              <div style={{ position: 'relative' }}>
                <FormRow
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isFormDisabled}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-text-secondary)',
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  }
                />
              </div>

              <div className={styles['options']}>
                <Checkbox
                  id="remember"
                  name="remember"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRememberMe(e.target.checked)
                  }
                  disabled={isFormDisabled}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={state === 'loading'}
                disabled={isFormDisabled || !email || !password}
                className={styles['submitButton']}
              >
                {state === 'loading' ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className={styles['footer']}>
                <a
                  href="/forgot-password"
                  className={styles['forgotLink']}
                  tabIndex={isFormDisabled ? -1 : 0}
                >
                  Forgot password?
                </a>
              </div>
            </fieldset>
          </form>

          <div className={styles['copyright']}>© 2025 Vantage Lane</div>
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
