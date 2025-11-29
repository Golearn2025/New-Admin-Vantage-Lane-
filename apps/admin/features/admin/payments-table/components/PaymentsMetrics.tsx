/**
 * PaymentsMetrics Component
 * 
 * Calculates and displays payment metrics cards
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ UI-core components  
 * ✅ Centralized formatters
 */

import { useMemo } from 'react';
import { MiniMetricCard } from '@vantage-lane/ui-core';
import { formatPercentage } from '@/shared/utils/formatters';
import type { Payment } from '../types';
import styles from './PaymentsTable.module.css';

interface PaymentsMetricsProps {
  data: Payment[];
}

export function PaymentsMetrics({ data }: PaymentsMetricsProps) {
  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalTransactions = data.length;
    const totalAmount = data.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const successfulPayments = data.filter(p => p.status === 'captured' || p.status === 'authorized').length;
    const successRate = totalTransactions > 0 ? formatPercentage((successfulPayments / totalTransactions) * 100, 1) : formatPercentage(0, 1);
    
    return {
      totalTransactions,
      totalAmount: `£${(totalAmount / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      successRate: `${successRate}%`,
      successCount: successfulPayments,
    };
  }, [data]);

  return (
    <div className={styles.metricsGrid}>
      <MiniMetricCard
        label="Total Transactions"
        value={metrics.totalTransactions}
        icon="shopping-cart"
        iconColor="info"
      />
      <MiniMetricCard
        label="Total Amount"
        value={metrics.totalAmount}
        icon="dollar-circle"
        iconColor="success"
      />
      <MiniMetricCard
        label="Success Rate"
        value={metrics.successRate}
        icon="check"
        iconColor="success"
      />
      <MiniMetricCard
        label="Successful Payments"
        value={metrics.successCount}
        icon="trending-up"
        iconColor="theme"
      />
    </div>
  );
}
