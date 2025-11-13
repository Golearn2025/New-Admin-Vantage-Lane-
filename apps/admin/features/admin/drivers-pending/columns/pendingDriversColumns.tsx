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
              {driver.firstName?.[0] || '?'}{driver.lastName?.[0] || '?'}
            </div>
          )}
          <div>
            <div className={styles.name}>
              {driver.firstName || ''} {driver.lastName || ''}
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
        const driverComplete = driver.driverDocsApproved >= driver.driverDocsRequired;
        const vehicleComplete = driver.vehicleDocsApproved >= driver.vehicleDocsRequired;
        
        return (
          <div className={styles.docsCell}>
            <div className={styles.docsCategoryRow}>
              <span className={driverComplete ? styles.docsComplete : styles.docsIncomplete}>
                {driver.driverDocsApproved}/{driver.driverDocsRequired} Driver
              </span>
              {driverComplete && <span className={styles.checkmark}>✓</span>}
            </div>
            <div className={styles.docsCategoryRow}>
              <span className={vehicleComplete ? styles.docsComplete : styles.docsIncomplete}>
                {driver.vehicleDocsApproved}/{driver.vehicleDocsRequired} Vehicle
              </span>
              {vehicleComplete && <span className={styles.checkmark}>✓</span>}
            </div>
          </div>
        );
      },
      width: '180px',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (driver: PendingDriver) => {
        const driverComplete = driver.driverDocsApproved >= driver.driverDocsRequired;
        const vehicleComplete = driver.vehicleDocsApproved >= driver.vehicleDocsRequired;
        
        let statusLabel = '';
        let statusClass = styles.statusPending;
        
        if (driverComplete && vehicleComplete) {
          statusLabel = 'Complete';
          statusClass = styles.docsComplete;
        } else if (driverComplete) {
          statusLabel = 'Driver Complete';
          statusClass = styles.statusUploaded;
        } else if (vehicleComplete) {
          statusLabel = 'Vehicle Complete';
          statusClass = styles.statusUploaded;
        } else if (driver.driverDocsApproved > 0 || driver.vehicleDocsApproved > 0) {
          statusLabel = 'Incomplete';
          statusClass = styles.statusReview;
        } else {
          statusLabel = 'Not Started';
          statusClass = styles.statusPending;
        }
        
        return <span className={statusClass}>{statusLabel}</span>;
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
