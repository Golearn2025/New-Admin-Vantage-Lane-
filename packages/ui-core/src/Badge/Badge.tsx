/**
 * Badge Component
 * 
 * Generic, reusable badge component for displaying status, categories, and other labels.
 * 100% type-safe, 100% design tokens, fully reusable.
 * 
 * @example
 * ```tsx
 * <Badge variant="status" value="NEW" size="md" />
 * <Badge variant="trip_type" value="oneway" />
 * <Badge variant="category" value="EXEC" icon={<CarIcon />} />
 * ```
 */

import React from 'react';
import styles from './Badge.module.css';
import { BadgeProps, BADGE_LABELS } from './types';

export const Badge: React.FC<BadgeProps> = ({
  variant,
  value,
  size = 'md',
  icon,
  className,
  onClick,
  disabled = false,
}) => {
  // Build CSS classes
  const classes = [
    styles.badge,
    styles[`size-${size}`],
    styles[`variant-${variant}-${value}`],
    onClick && styles.clickable,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Get display label
  const label = BADGE_LABELS[value] || value;

  // Handle click
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // Handle keyboard interaction
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <span
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      data-variant={variant}
      data-value={value}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

Badge.displayName = 'Badge';
