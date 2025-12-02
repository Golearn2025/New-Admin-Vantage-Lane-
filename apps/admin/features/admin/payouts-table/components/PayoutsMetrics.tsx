/**
 * PayoutsMetrics Component
 * Metrics cards for payouts overview
 * < 50 lines - RULES.md compliant
 */

'use client';

import React, { useMemo } from 'react';
import { MiniMetricCard } from '@vantage-lane/ui-core';
import styles from './PayoutsTable.module.css';

interface PayoutsMetricsProps {
  totalPayouts: string;
  totalAmount: string;
  pendingPayouts: string;
  completedPayouts: string;
}

export function PayoutsMetrics({ 
  totalPayouts, 
  totalAmount, 
  pendingPayouts, 
  completedPayouts 
}: PayoutsMetricsProps) {
  return (
    <div className={styles.metricsGrid}>
      <MiniMetricCard
        label="Total Payouts"
        value={totalPayouts}
        icon="wallet"
        iconColor="info"
      />
      <MiniMetricCard
        label="Total Amount"
        value={totalAmount}
        icon="dollar-circle"
        iconColor="success"
      />
      <MiniMetricCard
        label="Pending"
        value={pendingPayouts}
        icon="clock"
        iconColor="warning"
      />
      <MiniMetricCard
        label="Completed"
        value={completedPayouts}
        icon="check"
        iconColor="success"
      />
    </div>
  );
}
