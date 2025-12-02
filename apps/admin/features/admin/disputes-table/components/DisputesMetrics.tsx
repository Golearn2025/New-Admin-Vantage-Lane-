/**
 * DisputesMetrics Component
 * 
 * Displays metrics cards for disputes table - focused on metrics calculation and display
 */

'use client';

import React, { useMemo } from 'react';
import { MiniMetricCard } from '@vantage-lane/ui-core';
import styles from './DisputesTable.module.css';

interface DisputesMetricsProps {
  data: any[]; // Using any[] to match the original component pattern
}

export function DisputesMetrics({ data }: DisputesMetricsProps) {
  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const activeDisputes = data.filter(d => d.status !== 'won' && d.status !== 'lost').length;
    const urgentCases = data.filter(d => d.status === 'needs_response' || d.status.includes('warning')).length;
    const totalAmount = data.reduce((sum, dispute) => sum + (dispute.amount || 0), 0);
    const wonDisputes = data.filter(d => d.status === 'won').length;
    const totalDecided = data.filter(d => d.status === 'won' || d.status === 'lost').length;
    const wonRate = totalDecided > 0 ? ((wonDisputes / totalDecided) * 100).toFixed(0) : '0';
    
    return {
      activeDisputes,
      urgentCases,
      amountAtRisk: `£${(totalAmount / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      wonRate: `${wonRate}%`,
    };
  }, [data]);

  return (
    <div className={styles.metricsGrid}>
      <MiniMetricCard
        label="Active Disputes"
        value={metrics.activeDisputes}
        icon="bell"
        iconColor="warning"
      />
      <MiniMetricCard
        label="Urgent Cases"
        value={metrics.urgentCases}
        icon="lightning"
        iconColor="danger"
      />
      <MiniMetricCard
        label="Won Rate"
        value={metrics.wonRate}
        icon="check"
        iconColor="success"
      />
      <MiniMetricCard
        label="Amount at Risk"
        value={metrics.amountAtRisk}
        icon="dollar-circle"
        iconColor="warning"
      />
    </div>
  );
}
