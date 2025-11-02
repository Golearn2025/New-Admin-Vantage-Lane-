/**
 * PaymentsOverview Component
 * Dashboard cu stats și recent payments
 */

'use client';

import React from 'react';
import { PaymentsTable } from '@features/payments-table';
import styles from './PaymentsOverview.module.css';

export function PaymentsOverview() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payments Overview</h1>
          <p className={styles.description}>
            Monitor all payment transactions and activity
          </p>
        </div>
      </div>

      {/* Payments Table with Metrics */}
      <PaymentsTable />
    </div>
  );
}
