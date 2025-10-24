/**
 * UserBadge Component - PREMIUM
 * 
 * Beautiful, reusable badge for user types
 * Used across All Users, Drivers, Customers, Operators, Admins tables
 * 
 * Features:
 * - 4 user types with distinct colors
 * - Icon support
 * - Multiple sizes
 * - 100% design tokens
 * - Gradient backgrounds
 */

'use client';

import React from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './UserBadge.module.css';

export type UserType = 'customer' | 'driver' | 'admin' | 'operator';
export type UserBadgeSize = 'sm' | 'md' | 'lg';

export interface UserBadgeProps {
  /** User type */
  type: UserType;
  /** Badge size */
  size?: UserBadgeSize;
  /** Show icon */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

const USER_CONFIG: Record<UserType, { icon: IconName; label: string }> = {
  customer: {
    icon: 'users',
    label: 'Customer',
  },
  driver: {
    icon: 'user-circle',
    label: 'Driver',
  },
  admin: {
    icon: 'settings',
    label: 'Admin',
  },
  operator: {
    icon: 'star',
    label: 'Operator',
  },
};

export function UserBadge({
  type,
  size = 'md',
  showIcon = true,
  className = '',
}: UserBadgeProps) {
  const config = USER_CONFIG[type];
  const sizeClass = styles[`size-${size}`];
  const typeClass = styles[`type-${type}`];

  return (
    <span className={`${styles.badge} ${sizeClass} ${typeClass} ${className}`}>
      {showIcon && (
        <Icon
          name={config.icon}
          size={size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'xs'}
        />
      )}
      <span className={styles.label}>{config.label}</span>
    </span>
  );
}
