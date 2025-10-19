/**
 * StatusBadge Component
 * 
 * Premium status badge with glow effects for critical statuses
 * Follows design tokens - 100% reusable
 */

import React from 'react';
import './StatusBadge.css';

export type BookingStatus = 
  | 'pending'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface StatusBadgeProps {
  status: BookingStatus;
  isUrgent?: boolean;
  isNew?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: '🔵',
    className: 'status-badge--pending',
  },
  assigned: {
    label: 'Assigned',
    icon: '🟡',
    className: 'status-badge--assigned',
  },
  en_route: {
    label: 'En Route',
    icon: '🚗',
    className: 'status-badge--en-route',
  },
  arrived: {
    label: 'Arrived',
    icon: '📍',
    className: 'status-badge--arrived',
  },
  in_progress: {
    label: 'In Progress',
    icon: '🟢',
    className: 'status-badge--in-progress',
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    className: 'status-badge--completed',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '🔴',
    className: 'status-badge--cancelled',
  },
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isUrgent = false,
  isNew = false,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const config = STATUS_CONFIG[status];

  const classes = [
    'status-badge',
    config.className,
    `status-badge--${size}`,
    isUrgent && 'status-badge--urgent',
    isNew && 'status-badge--new',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {showIcon && <span className="status-badge__icon">{config.icon}</span>}
      <span className="status-badge__label">{config.label}</span>
      {isUrgent && (
        <span className="status-badge__urgent-indicator">URGENT</span>
      )}
      {isNew && <span className="status-badge__new-indicator">NEW</span>}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
