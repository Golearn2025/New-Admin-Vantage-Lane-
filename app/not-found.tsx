/**
 * 404 Not Found Page
 *
 * Custom 404 page for better UX.
 * Displayed when user navigates to non-existent route.
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: 'var(--vl-color-background, #0a0a0a)',
        color: 'var(--color-text-primary, #ffffff)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        {/* 404 Icon */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: '800',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #F1D16A 0%, #C9A959 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
          }}
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary, #a0a0a0)',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'var(--color-primary, #F1D16A)',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'opacity 0.2s',
            }}
          >
            Go to Dashboard
          </Link>

          <Link
            href="/bookings"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary, #ffffff)',
              textDecoration: 'none',
              border: '1px solid var(--color-border, #333)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s',
            }}
          >
            View Bookings
          </Link>
        </div>

        {/* Navigation hint */}
        <div
          style={{
            marginTop: '48px',
            padding: '16px',
            background: 'rgba(241, 209, 106, 0.05)',
            border: '1px solid rgba(241, 209, 106, 0.2)',
            borderRadius: '8px',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary, #a0a0a0)',
              margin: '0 0 8px 0',
            }}
          >
            <strong>Quick Links:</strong>
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: '14px',
            }}
          >
            <Link
              href="/bookings"
              style={{ color: 'var(--color-primary, #F1D16A)', textDecoration: 'none' }}
            >
              Bookings
            </Link>
            <Link
              href="/users"
              style={{ color: 'var(--color-primary, #F1D16A)', textDecoration: 'none' }}
            >
              Users
            </Link>
            <Link
              href="/settings"
              style={{ color: 'var(--color-primary, #F1D16A)', textDecoration: 'none' }}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
