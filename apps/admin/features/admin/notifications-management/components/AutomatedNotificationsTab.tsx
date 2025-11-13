'use client';

import { Hourglass, Car } from 'lucide-react';
import React from 'react';

/**
 * Automated Notifications Tab
 * Configure automated notification rules
 */
import styles from './AutomatedNotificationsTab.module.css';

export function AutomatedNotificationsTab() {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>⚙️</div>
        <h3 className={styles.title}>Automated Notifications</h3>
        <p className={styles.description}>
          Configure automated notifications for document expiry, inactive accounts,
          pending verifications, and other system events.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📄</span>
            <span>Document Expiry Alerts</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💤</span>
            <span>Inactive Account Reminders</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}><Hourglass size={18} strokeWidth={2} /></span>
            <span>Pending Verification Alerts</span>
          </div>
        </div>
        <div className={styles.comingSoon}>Coming Soon</div>
      </div>
    </div>
  );
}
