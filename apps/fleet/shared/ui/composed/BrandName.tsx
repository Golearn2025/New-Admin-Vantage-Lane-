/**
 * BrandName Component - Fleet Portal
 */

import React from 'react';

interface BrandNameProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BrandName({ size = 'md' }: BrandNameProps) {
  const fontSize = size === 'lg' ? '20px' : size === 'md' ? '16px' : '14px';
  
  return (
    <span style={{ fontSize, fontWeight: 600, color: 'var(--color-text-primary)' }}>
      Vantage Lane
    </span>
  );
}
