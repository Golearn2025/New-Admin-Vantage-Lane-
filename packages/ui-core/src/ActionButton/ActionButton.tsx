/**
 * ActionButton Component
 *
 * Reusable action button for tables and forms.
 * 100% design tokens, NO business logic, fully modular.
 *
 * Usage:
 * <ActionButton
 *   variant="primary"
 *   icon={<AssignIcon />}
 *   label="Assign Driver"
 *   onClick={handleClick}
 * />
 */

import React from 'react';
import { ActionButtonProps } from './ActionButton.types';
import styles from './ActionButton.module.css';

export function ActionButton({
  variant = 'secondary',
  size = 'md',
  icon,
  label,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}: ActionButtonProps) {
  const isIconOnly = !label;

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isIconOnly && styles.iconOnly,
    loading && styles.loading,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )
      )}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
