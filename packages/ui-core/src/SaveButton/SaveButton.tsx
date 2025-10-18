/**
 * SaveButton Component - PREMIUM
 * 
 * Button premium pentru save actions.
 * Limită: ≤80 linii
 */

'use client';

import React from 'react';
import styles from './SaveButton.module.css';

export interface SaveButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function SaveButton({
  onClick,
  loading = false,
  disabled = false,
  children,
  variant = 'primary',
}: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.button} ${styles[variant]} ${loading ? styles.loading : ''}`}
    >
      {loading ? (
        <>
          <span className={styles.spinner} />
          Saving...
        </>
      ) : (
        children
      )}
    </button>
  );
}
