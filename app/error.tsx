'use client';

/**
 * Error Boundary - Global Error Handler
 *
 * Catches all errors in the app and displays a friendly error page.
 * Logs errors to logger for monitoring.
 *
 * Next.js automatic error boundary - wraps all routes.
 */

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('Application error caught by boundary', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        {/* Error Icon */}
        <div className={styles.errorIcon}>
          ⚠️
        </div>

        {/* Error Title */}
        <h1 className={styles.errorTitle}>
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className={styles.errorMessage}>
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className={styles.errorDetails}>
            <summary className={styles.errorSummary}>
              Error Details (Dev Only)
            </summary>
            <pre className={styles.errorPre}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className={styles.errorActions}>
          <button
            onClick={reset}
            className={styles.primaryButton}
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className={styles.secondaryButton}
          >
            Go to Dashboard
          </button>
        </div>

        {/* Support Info */}
        <p className={styles.supportText}>
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
