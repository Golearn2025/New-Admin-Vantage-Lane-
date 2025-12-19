/**
 * ResetPasswordForm Component
 *
 * Presentational component - ZERO business logic.
 * Uses useResetPasswordForm hook for all state management.
 * Uses lucide-react icons.
 */

'use client';

import { CheckCircle, XCircle, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button, FormRow } from '@vantage-lane/ui-core';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import styles from './ResetPasswordForm.module.css';

export function ResetPasswordForm() {
  const {
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
  } = useResetPasswordForm();

  // Loading state - verifying token
  if (state === 'loading') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.iconWrapper}>
          <Loader2 size={64} className={styles.loadingIcon} />
        </div>
        <h2 className={styles.title}>Verifying reset link...</h2>
        <p className={styles.message}>Please wait while we verify your reset link.</p>
      </div>
    );
  }

  // Invalid token state
  if (state === 'invalid_token') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.iconWrapperError}>
          <XCircle size={64} className={styles.errorIcon} />
        </div>
        <h2 className={styles.title}>Link Expired</h2>
        <p className={styles.message}>{error}</p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" asChild>
            <a href="/forgot-password">Request New Link</a>
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.iconWrapperSuccess}>
          <CheckCircle size={64} className={styles.successIcon} />
        </div>
        <h2 className={styles.title}>Password Updated!</h2>
        <p className={styles.message}>
          Your password has been successfully changed. You can now sign in with your new password.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
        <p className={styles.appHint}>
          If you're using the mobile app, you can close this page and return to the app.
        </p>
      </div>
    );
  }

  // Form state (ready or error or submitting)
  const isFormDisabled = state === 'submitting';

  return (
    <>
      <div className={styles.description}>
        <p>Enter your new password below. Make sure it's strong and secure.</p>
      </div>

      {state === 'error' && error && (
        <div className={styles.errorBanner}>
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className={styles.fieldset} disabled={isFormDisabled}>
          <div className={styles.passwordFieldWrapper}>
            <FormRow
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              value={password}
              onChange={handlePasswordChange}
              required={true}
              autoComplete="new-password"
              autoFocus={true}
              placeholder="Enter new password"
              disabled={isFormDisabled}
              rightIcon={
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className={styles.passwordToggle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          {/* Password strength indicators */}
          <div className={styles.validationList}>
            <ValidationItem valid={validation.minLength} label="At least 8 characters" />
            <ValidationItem valid={validation.hasUppercase} label="One uppercase letter" />
            <ValidationItem valid={validation.hasLowercase} label="One lowercase letter" />
            <ValidationItem valid={validation.hasNumber} label="One number" />
            <ValidationItem valid={validation.hasSymbol} label="One special character (optional)" optional />
          </div>

          <FormRow
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required={true}
            autoComplete="new-password"
            placeholder="Confirm new password"
            disabled={isFormDisabled}
          />

          {confirmPassword && !validation.passwordsMatch && (
            <p className={styles.mismatchError}>Passwords do not match</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={state === 'submitting'}
            disabled={isFormDisabled || !isValid}
            className={styles.submitButton}
          >
            {state === 'submitting' ? 'Updating...' : 'Update Password'}
          </Button>

          <div className={styles.footer}>
            <a href="/login" className={styles.backLink}>
              ← Back to login
            </a>
          </div>
        </fieldset>
      </form>
    </>
  );
}

// Helper component for validation items
function ValidationItem({ valid, label, optional }: { valid: boolean; label: string; optional?: boolean }) {
  return (
    <div className={`${styles.validationItem} ${valid ? styles.valid : ''} ${optional ? styles.optional : ''}`}>
      {valid ? <Check size={14} /> : <X size={14} />}
      <span>{label}</span>
    </div>
  );
}
