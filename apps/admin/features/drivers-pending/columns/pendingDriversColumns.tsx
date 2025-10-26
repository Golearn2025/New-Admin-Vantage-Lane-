/**
 * Pending Drivers Table Columns
 */

import React from 'react';
import type { Column } from '@vantage-lane/ui-core';
import { Button } from '@vantage-lane/ui-core';
import type { PendingDriver } from '../types';
import styles from './pendingDriversColumns.module.css';

export function getPendingDriversColumns(options: {
  onView: (driver: PendingDriver) => void;
  onVerify: (driver: PendingDriver) => void;
}): Column<PendingDriver>[] {
  return [
    {
      id: 'name',
      header: 'Driver Name',
      cell: (driver: PendingDriver) => (
        <div className={styles.nameCell}>
          {driver.profilePhotoUrl ? (
            <img src={driver.profilePhotoUrl} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {driver.firstName[0]}{driver.lastName[0]}
            </div>
          )}
          <div>
            <div className={styles.name}>
              {driver.firstName} {driver.lastName}
            </div>
            <div className={styles.email}>{driver.email}</div>
          </div>
        </div>
      ),
      width: '250px',
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: (driver: PendingDriver) => driver.phone || 'N/A',
      width: '150px',
    },
    {
      id: 'documents',
      header: 'Documents',
      cell: (driver: PendingDriver) => {
        const hasAllDocs = driver.documentsCount >= driver.requiredDocumentsCount;
        return (
          <div className={styles.docsCell}>
            <span className={hasAllDocs ? styles.docsComplete : styles.docsIncomplete}>
              {driver.documentsCount}/{driver.requiredDocumentsCount}
            </span>
            {hasAllDocs && <span className={styles.checkmark}>✓</span>}
          </div>
        );
      },
      width: '120px',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (driver: PendingDriver) => {
        const statusMap = {
          pending: { label: 'Pending', class: styles.statusPending },
          docs_uploaded: { label: 'Docs Uploaded', class: styles.statusUploaded },
          in_review: { label: 'In Review', class: styles.statusReview },
        };
        const status = statusMap[driver.verificationStatus];
        return <span className={status.class}>{status.label}</span>;
      },
      width: '140px',
    },
    {
      id: 'uploadedAt',
      header: 'Uploaded',
      cell: (driver: PendingDriver) => {
        if (!driver.uploadedAt) return 'Not yet';
        const date = new Date(driver.uploadedAt);
        return formatRelativeTime(date);
      },
      width: '120px',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (driver: PendingDriver) => (
        <div className={styles.actions}>
          <Button size="sm" variant="secondary" onClick={() => options.onView(driver)}>
            View
          </Button>
          <Button size="sm" variant="primary" onClick={() => options.onVerify(driver)}>
            Verify
          </Button>
        </div>
      ),
      width: '180px',
    },
  ];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
