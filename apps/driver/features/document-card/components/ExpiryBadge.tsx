/**
 * Expiry Badge Component
 * 
 * Display document status with premium badges.
 */

import React from 'react';
import type { DocumentStatus, DocumentWithExpiry } from '../../../entities/driver-document';
import styles from './ExpiryBadge.module.css';

interface ExpiryBadgeProps {
  document: DocumentWithExpiry;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { icon: string; label: string }
> = {
  pending: { icon: '⏳', label: 'Pending Review' },
  approved: { icon: '✓', label: 'Approved' },
  rejected: { icon: '✕', label: 'Rejected' },
  expired: { icon: '⚠️', label: 'Expired' },
  expiring_soon: { icon: '⏰', label: 'Expiring Soon' },
};

export function ExpiryBadge({ document }: ExpiryBadgeProps) {
  const getStatusClass = (): string => {
    if (document.is_expired) return styles.expired || '';
    if (document.is_expiring_soon) return styles.expiring_soon || '';
    
    const statusKey = document.status as keyof typeof styles;
    return styles[statusKey] || styles.pending || '';
  };

  const getStatusInfo = () => {
    if (document.is_expired) {
      return {
        icon: STATUS_CONFIG.expired.icon,
        label: `Expired ${Math.abs(document.days_until_expiry || 0)} days ago`,
      };
    }

    if (document.is_expiring_soon && document.days_until_expiry !== null) {
      return {
        icon: STATUS_CONFIG.expiring_soon.icon,
        label: `Expires in ${document.days_until_expiry} days`,
      };
    }

    return STATUS_CONFIG[document.status];
  };

  const statusInfo = getStatusInfo();
  const badgeClass = `${styles.badge} ${getStatusClass()}`;

  return (
    <span className={badgeClass}>
      <span className={styles.icon}>{statusInfo.icon}</span>
      <span>{statusInfo.label}</span>
    </span>
  );
}
