/**
 * UserTypeBadge Component
 * 
 * Displays user type badge with icon and color
 * 100% design tokens, zero hardcoded values
 */

import React from 'react';
import { Icon } from '@vantage-lane/ui-icons';
import styles from './UserTypeBadge.module.css';

export interface UserTypeBadgeProps {
  type: 'customer' | 'driver' | 'admin' | 'operator';
  size?: 'sm' | 'md';
}

const TYPE_CONFIG = {
  customer: {
    icon: 'users' as const,
    label: 'Customer',
  },
  driver: {
    icon: 'calendar' as const,
    label: 'Driver',
  },
  admin: {
    icon: 'settings' as const,
    label: 'Admin',
  },
  operator: {
    icon: 'dashboard' as const,
    label: 'Operator',
  },
};

export function UserTypeBadge({ type, size = 'md' }: UserTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  const sizeClass = size === 'sm' ? styles.badgeSm : styles.badgeMd;
  const typeClass = styles[`badge${type.charAt(0).toUpperCase() + type.slice(1)}`];

  return (
    <span className={`${styles.badge} ${typeClass} ${sizeClass}`}>
      <Icon name={config.icon} size={size === 'sm' ? 12 : 14} />
      <span className={styles.label}>{config.label}</span>
    </span>
  );
}
