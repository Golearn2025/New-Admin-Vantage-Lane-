/**
 * ForgotPasswordForm Component
 * 
 * Presentational component - ZERO business logic.
 * Uses useForgotPasswordForm hook for all state management.
 * Uses lucide-react icons (CheckCircle) instead of emoji.
 */

'use client';

import { CheckCircle } from 'lucide-react';
import {
  FormRow,
  ErrorBanner,
  Button,
} from '@vantage-lane/ui-core';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import styles from './ForgotPasswordForm.module.css';

export function ForgotPasswordForm() {
  const {
    email,
    state,
    error,
    isFormDisabled,
    handleEmailChange,
    handleSubmit,
  } = useForgotPasswordForm();

  // Success state
  if (state === 'success') {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <CheckCircle size={64} className={styles.icon} />
        </div>
        <p className={styles.successMessage}>
          We've sent a password reset link to:
        </p>
        <strong className={styles.email}>{email}</strong>
        <p className={styles.instructions}>
          Please check your inbox and follow the instructions to reset your password.
        </p>
        <p className={styles.note}>
          Didn't receive the email? Check your spam folder or try again in a few minutes.
        </p>
        <a href="/login" className={`${styles.backButton} touch-target`}>
          Back to login
        </a>
      </div>
    );
  }

  // Form state
  return (
    <>
      <div className={styles.description}>
        <p>
          Enter your email address and we'll send you a link to reset your password.
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={state === 'loading'}
            disabled={isFormDisabled || !email}
            className={styles.submitButton}
          >
            {state === 'loading' ? 'Sending...' : 'Send reset link'}
          </Button>

          <div className={styles.footer}>
            <a
              href="/login"
              className={`${styles.backLink} touch-target`}
              tabIndex={isFormDisabled ? -1 : 0}
            >
              ← Back to login
            </a>
          </div>
        </fieldset>
      </form>
    </>
  );
}
