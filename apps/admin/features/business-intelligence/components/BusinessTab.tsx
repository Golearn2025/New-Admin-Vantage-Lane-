/**
 * BusinessTab — Bookings overview + status breakdown table
 *
 * REGULA 8: EnterpriseDataTable | REGULA 11: < 200 lines
 */

'use client';

import type { BIData, StatusBreakdown } from '@entities/business-intelligence';
import { capitalize, formatCurrency, formatNumber, formatPercent } from '@entities/business-intelligence';
import type { Column } from '@vantage-lane/ui-core';
import { Badge, EnterpriseDataTable, StatCard } from '@vantage-lane/ui-core';
import { useMemo } from 'react';
import styles from './BIPage.module.css';

interface Props { data: BIData }

function statusColor(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    completed: 'success', pending: 'warning', cancelled: 'danger',
    assigned: 'info', en_route: 'info', arrived: 'success',
  };
  return map[status] ?? 'neutral';
}

export function BusinessTab({ data }: Props) {
  const { bookings } = data;

  const columns: Column<StatusBreakdown>[] = useMemo(() => [
    { id: 'status', header: 'Status', accessor: (r) => r.status, cell: (r) => <Badge color={statusColor(r.status)} size="sm" variant="solid">{capitalize(r.status)}</Badge>, width: '160px' },
    { id: 'count', header: 'Bookings', accessor: (r) => r.count, cell: (r) => formatNumber(r.count), align: 'right' as const, sortable: true },
    { id: 'percentage', header: '% of Total', accessor: (r) => r.percentage, cell: (r) => formatPercent(r.percentage), align: 'right' as const, sortable: true },
    { id: 'revenue', header: 'Revenue', accessor: (r) => r.revenue, cell: (r) => formatCurrency(r.revenue), align: 'right' as const, sortable: true },
  ], []);

  return (
    <div className={styles.tabContent}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Bookings" value={formatNumber(bookings.totalBookings)} chartColor="theme" />
        <StatCard label="Completed" value={formatNumber(bookings.statusBreakdown.find(s => s.status === 'completed')?.count ?? 0)} chartColor="success" />
        <StatCard label="Pending" value={formatNumber(bookings.statusBreakdown.find(s => s.status === 'pending')?.count ?? 0)} chartColor="warning" />
        <StatCard label="Completion Rate" value={formatPercent(bookings.completionRate)} chartColor="info" />
      </div>

      <h3 className={styles.sectionTitle}>Status Breakdown</h3>
      <EnterpriseDataTable<StatusBreakdown>
        data={bookings.statusBreakdown}
        columns={columns}
        stickyHeader
        striped
        ariaLabel="Booking status breakdown"
        emptyState="No booking data available"
      />
    </div>
  );
}
