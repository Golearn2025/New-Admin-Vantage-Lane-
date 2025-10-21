'use client';

/**
 * Global Error Boundary
 *
 * Catches errors in the root layout.
 * This is the last resort error handler - even if root layout fails.
 *
 * NOTE: global-error.tsx MUST be in app/ root and MUST include <html> and <body> tags.
 */

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error to monitoring service
    logger.error('CRITICAL: Global error boundary triggered', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0a0a0a',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
            }}
          >
            {/* Critical Error Icon */}
            <div
              style={{
                fontSize: '80px',
                marginBottom: '24px',
              }}
            >
              🚨
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#ff6b6b',
              }}
            >
              Critical Error
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '16px',
                color: '#a0a0a0',
                marginBottom: '32px',
                lineHeight: '1.6',
              }}
            >
              A critical error occurred. Our team has been automatically notified. Please try
              refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <details
                style={{
                  marginBottom: '32px',
                  padding: '16px',
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#ff6b6b',
                  }}
                >
                  Technical Details (Dev Only)
                </summary>
                <pre
                  style={{
                    fontSize: '12px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#a0a0a0',
                  }}
                >
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#F1D16A',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <p
              style={{
                marginTop: '32px',
                fontSize: '12px',
                color: '#666',
              }}
            >
              Error ID: {error.digest || 'N/A'}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
