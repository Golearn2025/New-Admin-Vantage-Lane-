/**
 * Root Loading State
 *
 * Shown while pages are loading (suspense fallback).
 * Provides better UX during navigation and data fetching.
 */

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--vl-color-background, #0a0a0a)',
        color: 'var(--color-text-primary, #ffffff)',
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(241, 209, 106, 0.1)',
          borderTop: '4px solid var(--color-primary, #F1D16A)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />

      {/* Loading Text */}
      <p
        style={{
          marginTop: '24px',
          fontSize: '16px',
          color: 'var(--color-text-secondary, #a0a0a0)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Loading...
      </p>

      {/* Inline animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
