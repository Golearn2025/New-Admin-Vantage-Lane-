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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'var(--vl-color-background, #0a0a0a)',
      color: 'var(--color-text-primary, #ffffff)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        {/* Error Icon */}
        <div style={{
          fontSize: '64px',
          marginBottom: '24px',
        }}>
          ⚠️
        </div>

        {/* Error Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '16px',
          color: 'var(--color-danger, #ff6b6b)',
        }}>
          Something went wrong
        </h1>

        {/* Error Message */}
        <p style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary, #a0a0a0)',
          marginBottom: '32px',
          lineHeight: '1.6',
        }}>
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details style={{
            marginBottom: '32px',
            padding: '16px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            textAlign: 'left',
          }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--color-danger, #ff6b6b)',
            }}>
              Error Details (Dev Only)
            </summary>
            <pre style={{
              fontSize: '12px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'var(--color-text-secondary, #a0a0a0)',
            }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-primary, #F1D16A)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary, #ffffff)',
              border: '1px solid var(--color-border, #333)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Go to Dashboard
          </button>
        </div>

        {/* Support Info */}
        <p style={{
          marginTop: '32px',
          fontSize: '14px',
          color: 'var(--color-text-secondary, #666)',
        }}>
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
