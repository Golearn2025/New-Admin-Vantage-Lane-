/**
 * StatusBadge Component
 *
 * Premium status badge with glow effects for critical statuses
 * Follows design tokens - 100% reusable
 */

import React from 'react';
import { Icon } from '../../Icon/Icon';
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
    label: 'New Booking',
    className: 'status-badge--pending',
  },
  assigned: {
    label: 'Assigned',
    className: 'status-badge--assigned',
  },
  en_route: {
    label: 'En Route',
    className: 'status-badge--en-route',
  },
  arrived: {
    label: 'Arrived',
    className: 'status-badge--arrived',
  },
  in_progress: {
    label: 'In Progress',
    className: 'status-badge--in-progress',
  },
  completed: {
    label: 'Completed',
    className: 'status-badge--completed',
  },
  cancelled: {
    label: 'Cancelled',
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
      {isNew && (
        <span className="status-badge__bell-icon">
          <Icon name="bell" size="xs" />
        </span>
      )}
      <span className="status-badge__label">{config.label}</span>
      {isUrgent && <span className="status-badge__urgent-indicator">URGENT</span>}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
