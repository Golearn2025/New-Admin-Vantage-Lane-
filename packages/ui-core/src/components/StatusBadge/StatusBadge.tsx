/**
 * StatusBadge Component
 *
 * Premium status badge with glow effects for critical statuses
 * Follows design tokens - 100% reusable
 */

import { Bell, CircleCheck, CircleX, MapPinCheck, Navigation, UserCheck, Users } from 'lucide-react';
import React from 'react';
import styles from './StatusBadge.module.css';

export type BookingStatus =
  // Uppercase (DB format)
  | 'NEW'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  // Lowercase (API format)
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
  // Uppercase (DB format)
  NEW: {
    label: 'New Booking',
    className: styles.statusBadgePending,
    icon: <Bell size={14} strokeWidth={2} />,
  },
  ASSIGNED: {
    label: 'Assigned',
    className: styles.statusBadgeAssigned,
    icon: <UserCheck size={14} strokeWidth={2} />,
  },
  EN_ROUTE: {
    label: 'En Route',
    className: styles.statusBadgeEnRoute,
    icon: <Navigation size={14} strokeWidth={2} />,
  },
  ARRIVED: {
    label: 'Arrived',
    className: styles.statusBadgeArrived,
    icon: <MapPinCheck size={14} strokeWidth={2} />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: styles.statusBadgeInProgress,
    icon: <Users size={14} strokeWidth={2} />,
  },
  COMPLETED: {
    label: 'Completed',
    className: styles.statusBadgeCompleted,
    icon: <CircleCheck size={14} strokeWidth={2} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: styles.statusBadgeCancelled,
    icon: <CircleX size={14} strokeWidth={2} />,
  },
  // Lowercase (API format) - same as uppercase
  pending: {
    label: 'New Booking',
    className: styles.statusBadgePending,
    icon: <Bell size={14} strokeWidth={2} />,
  },
  assigned: {
    label: 'Assigned',
    className: styles.statusBadgeAssigned,
    icon: <UserCheck size={14} strokeWidth={2} />,
  },
  en_route: {
    label: 'En Route',
    className: styles.statusBadgeEnRoute,
    icon: <Navigation size={14} strokeWidth={2} />,
  },
  arrived: {
    label: 'Arrived',
    className: styles.statusBadgeArrived,
    icon: <MapPinCheck size={14} strokeWidth={2} />,
  },
  in_progress: {
    label: 'In Progress',
    className: styles.statusBadgeInProgress,
    icon: <Users size={14} strokeWidth={2} />,
  },
  completed: {
    label: 'Completed',
    className: styles.statusBadgeCompleted,
    icon: <CircleCheck size={14} strokeWidth={2} />,
  },
  cancelled: {
    label: 'Cancelled',
    className: styles.statusBadgeCancelled,
    icon: <CircleX size={14} strokeWidth={2} />,
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

  // Bell + glow only for pending/NEW statuses
  const isPending = status === 'pending' || status === 'NEW';
  const showBell = isNew && isPending;

  const classes = [
    styles.statusBadge,
    config.className,
    size === 'sm' && styles.statusBadgeSm,
    size === 'md' && styles.statusBadgeMd,
    size === 'lg' && styles.statusBadgeLg,
    isUrgent && styles.statusBadgeUrgent,
    showBell && styles.statusBadgeNew,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {showBell && (
        <span className={styles.statusBadgeBellIcon}>
          <Bell size={12} strokeWidth={2} />
        </span>
      )}
      {showIcon && config.icon && !showBell && (
        <span className={styles.statusBadgeIcon}>{config.icon}</span>
      )}
      <span className={styles.statusBadgeLabel}>{config.label}</span>
      {isUrgent && <span className={styles.statusBadgeUrgentIndicator}>URGENT</span>}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
