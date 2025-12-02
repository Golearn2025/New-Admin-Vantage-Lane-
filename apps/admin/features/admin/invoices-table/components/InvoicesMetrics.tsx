/**
 * InvoicesMetrics Component
 * 
 * Displays metrics cards for invoices table - focused on metrics calculation and display
 */

'use client';

import React, { useMemo } from 'react';
import { MiniMetricCard } from '@vantage-lane/ui-core';
import type { InvoiceListItem } from '@entities/invoice';
import styles from './InvoicesTable.module.css';

interface InvoicesMetricsProps {
  data: InvoiceListItem[];
}

export function InvoicesMetrics({ data }: InvoicesMetricsProps) {
  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalInvoices = data.length;
    const totalAmount = data.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const overdueInvoices = data.filter(i => i.status === 'overdue').length;
    const paidInvoices = data.filter(i => i.status === 'paid').length;
    const paidRate = totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(0) : '0';
    
    return {
      totalInvoices,
      totalAmount,
      overdueInvoices,
      paidRate,
    };
  }, [data]);

  return (
    <div className={styles.metricsGrid}>
      <MiniMetricCard
        label="Total Invoices"
        value={metrics.totalInvoices}
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
        label="Overdue"
        value={metrics.overdueInvoices}
        icon="clock"
        iconColor="danger"
      />
      <MiniMetricCard
        label="Paid Rate"
        value={metrics.paidRate}
        icon="check"
        iconColor="success"
      />
    </div>
  );
}
