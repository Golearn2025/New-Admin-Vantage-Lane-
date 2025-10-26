/**
 * BrandName Component - Reusable Brand Identity
 *
 * Afișează "Vantage Lane" cu culorile brand:
 * - Vantage: auriu (ca logo-ul)
 * - Lane: argintiu
 * Folosește doar design tokens pentru culori.
 */

import React from 'react';
import styles from './BrandName.module.css';

export interface BrandNameProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BrandName({ size = 'md', className = '' }: BrandNameProps) {
  const brandClasses = `${styles['brandName']} ${styles[`size-${size}`]} ${className}`;

  return (
    <span className={brandClasses}>
      <span className={styles['vantage']}>Vantage</span>
      <span className={styles['lane']}>Lane</span>
    </span>
  );
}
