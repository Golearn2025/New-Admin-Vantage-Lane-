/**
 * ConfirmEmailStatus Component
 *
 * Presentational component - ZERO business logic.
 * Uses useConfirmEmail hook for all state management.
 * Uses lucide-react icons (CheckCircle, XCircle, Loader2).
 */

'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@vantage-lane/ui-core';
import { useConfirmEmail } from '../hooks/useConfirmEmail';
import styles from './ConfirmEmailStatus.module.css';

export function ConfirmEmailStatus() {
  const { state, error, userEmail } = useConfirmEmail();

  // Loading state
  if (state === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Loader2 size={64} className={styles.loadingIcon} />
        </div>
        <h2 className={styles.title}>Verifying your email...</h2>
        <p className={styles.message}>Please wait while we confirm your email address.</p>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapperError}>
          <XCircle size={64} className={styles.errorIcon} />
        </div>
        <h2 className={styles.title}>Verification Failed</h2>
        <p className={styles.message}>{error}</p>
        <p className={styles.hint}>
          The link may have expired or already been used. Please request a new confirmation email.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapperSuccess}>
        <CheckCircle size={64} className={styles.successIcon} />
      </div>
      <h2 className={styles.title}>Email Confirmed!</h2>
      {userEmail && <p className={styles.email}>{userEmail}</p>}
      <p className={styles.message}>
        Your email has been successfully verified. You can now sign in to your account.
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
