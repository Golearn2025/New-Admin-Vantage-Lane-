/**
 * BADGE COMPONENT - PREMIUM
 * 
 * Small label for status, counts, or categories
 * Perfect for tags, status indicators, notifications
 * 
 * Features:
 * - Multiple variants (solid, outline, soft)
 * - Color options
 * - Sizes
 * - Icon support
 * - Theme integration
 */

'use client';

import React from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'outline' | 'soft';
export type BadgeColor = 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'magenta' | 'burnred' | 'lightblue';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Badge color */
  color?: BadgeColor;
  /** Badge size */
  size?: BadgeSize;
  /** Icon (optional) */
  icon?: IconName;
  /** Removable badge */
  onRemove?: () => void;
  /** Custom className */
  className?: string;
}

export function Badge({
  children,
  variant = 'solid',
  color = 'theme',
  size = 'md',
  icon,
  onRemove,
  className = '',
}: BadgeProps) {
  const variantClass = styles[variant];
  const colorClass = styles[`color-${color}`];
  const sizeClass = styles[`size-${size}`];

  return (
    <span className={`${styles.badge} ${variantClass} ${colorClass} ${sizeClass} ${className}`}>
      {icon && (
        <Icon
          name={icon}
          size={size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs'}
          color="inherit"
        />
      )}
      <span className={styles.content}>{children}</span>
      {onRemove && (
        <button
          className={styles.removeButton}
          onClick={onRemove}
          type="button"
          aria-label="Remove"
        >
          <Icon name="x" size="xs" color="inherit" />
        </button>
      )}
    </span>
  );
}
