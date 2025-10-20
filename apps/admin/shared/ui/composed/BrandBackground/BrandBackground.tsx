/**
 * BrandBackground Component - Reutilizabil
 *
 * Background cu Cristi's 6-layer carbon fiber pentru întreaga aplicație.
 * Poate fi folosit în login, AppShell, sau oriunde altundeva.
 */

import React from 'react';
import styles from './BrandBackground.module.css';

export type BrandBackgroundProps = {
  variant?: 'login' | 'shell' | 'topbar';
  className?: string | undefined;
  children?: React.ReactNode;
};

export function BrandBackground({
  variant = 'login',
  className = '',
  children,
}: BrandBackgroundProps) {
  return (
    <div className={`${styles.bg} ${styles[variant]} ${className}`}>
      {/* Cristi's Carbon Fiber Layers */}
      <div className={styles.goldenAccents} />
      <div className={styles.verticalVignette} />
      <div className={styles.carbonHex} />
      <div className={styles.carbonWeave} />
      <div className={styles.metallicReflections} />

      {children}
    </div>
  );
}
