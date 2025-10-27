/**
 * BrandBackground Component - Driver Portal
 */

import React from 'react';

interface BrandBackgroundProps {
  variant?: 'auth' | 'shell';
  className?: string | undefined;
  children: React.ReactNode;
}

export function BrandBackground({ variant = 'shell', className, children }: BrandBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-background)',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
