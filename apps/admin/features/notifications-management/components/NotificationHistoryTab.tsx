/**
 * Notification History Tab
 * View all sent notifications
 */

'use client';

import React from 'react';
import styles from './NotificationHistoryTab.module.css';

export function NotificationHistoryTab() {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>📊</div>
        <h3 className={styles.title}>Notification History</h3>
        <p className={styles.description}>
          View all notifications sent by admins across the platform.
          This feature will track delivery status, read rates, and engagement metrics.
        </p>
        <div className={styles.comingSoon}>Coming Soon</div>
      </div>
    </div>
  );
}
