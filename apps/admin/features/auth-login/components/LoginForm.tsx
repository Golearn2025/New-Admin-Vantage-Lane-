/**
 * LoginForm Component
 *
 * Presentational component - ZERO business logic.
 * Uses useLoginForm hook for all state management.
 * Uses lucide-react icons (Eye/EyeOff) instead of emoji.
 */

'use client';

import { Button, Checkbox, ErrorBanner, FormRow } from '@vantage-lane/ui-core';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const {
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
  } = useLoginForm();

  return (
    <>
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
        <fieldset className={styles.fieldset} disabled={isFormDisabled}>
          <FormRow
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={email}
            onChange={handleEmailChange}
            required={true}
            autoComplete="username"
            autoFocus={true}
            placeholder="admin@test.com"
            disabled={isFormDisabled}
          />

          <div className={styles.passwordFieldWrapper}>
            <FormRow
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              required={true}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isFormDisabled}
              rightIcon={
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={20} className={styles.icon} />
                  ) : (
                    <Eye size={20} className={styles.icon} />
                  )}
                </button>
              }
            />
          </div>

          <div className={styles.options}>
            <Checkbox
              id="remember"
              name="remember"
              label="Remember me"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              disabled={isFormDisabled}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={state === 'loading'}
            disabled={isFormDisabled || !email || !password}
            className={styles.submitButton}
          >
            {state === 'loading' ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className={styles.footer}>
            <a
              href="/forgot-password"
              className={`${styles.forgotLink} touch-target`}
              tabIndex={isFormDisabled ? -1 : 0}
            >
              Forgot password?
            </a>
          </div>
        </fieldset>
      </form>

      <div className={styles.copyright}>© 2025 Vantage Lane</div>
    </>
  );
}
