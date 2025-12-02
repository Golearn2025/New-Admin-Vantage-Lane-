/**
 * RefundsMetrics Component
 * 
 * Displays metrics cards for refunds table - focused on metrics calculation and display
 */

'use client';

import React, { useMemo } from 'react';
import { MiniMetricCard } from '@vantage-lane/ui-core';
import styles from './RefundsTable.module.css';

interface RefundsMetricsProps {
  data: any[]; // Using any[] to match the original component pattern
}

export function RefundsMetrics({ data }: RefundsMetricsProps) {
  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalRefunds = data.length;
    const totalAmount = data.reduce((sum, refund) => sum + (refund.amount || 0), 0);
    const successfulRefunds = data.filter(r => r.status === 'succeeded').length;
    const successRate = totalRefunds > 0 ? ((successfulRefunds / totalRefunds) * 100).toFixed(1) : '0';
    
    return {
      totalRefunds,
      totalAmount: `£${(totalAmount / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      successRate: `${successRate}%`,
      pendingRefunds: data.filter(r => r.status === 'pending').length,
    };
  }, [data]);

  return (
    <div className={styles.metricsGrid}>
      <MiniMetricCard
        label="Total Refunds"
        value={metrics.totalRefunds}
        icon="refresh"
        iconColor="info"
      />
      <MiniMetricCard
        label="Refunded Amount"
        value={metrics.totalAmount}
        icon="dollar-circle"
        iconColor="warning"
      />
      <MiniMetricCard
        label="Success Rate"
        value={metrics.successRate}
        icon="check"
        iconColor="success"
      />
      <MiniMetricCard
        label="Pending Refunds"
        value={metrics.pendingRefunds}
        icon="clock"
        iconColor="warning"
      />
    </div>
  );
}
