/**
 * CustomersTab — Customer overview + activity table
 *
 * REGULA 8: EnterpriseDataTable | REGULA 11: < 200 lines
 */

'use client';

import type { BIData, CustomerRow } from '@entities/business-intelligence';
import { capitalize, formatCurrency, formatNumber } from '@entities/business-intelligence';
import type { Column } from '@vantage-lane/ui-core';
import { EnterpriseDataTable, StatCard } from '@vantage-lane/ui-core';
import { useMemo } from 'react';
import styles from './BIPage.module.css';

interface Props { data: BIData }

export function CustomersTab({ data }: Props) {
  const { customers } = data;

  const columns: Column<CustomerRow>[] = useMemo(() => [
    { id: 'name', header: 'Customer', accessor: (r) => r.name, cell: (r) => r.name, width: '160px' },
    { id: 'email', header: 'Email', accessor: (r) => r.email, cell: (r) => r.email, width: '200px', hideOnMobile: true },
    { id: 'status', header: 'Status', accessor: (r) => r.status, cell: (r) => capitalize(r.status), width: '100px' },
    { id: 'bookings', header: 'Bookings', accessor: (r) => r.bookings, cell: (r) => formatNumber(r.bookings), align: 'right' as const, sortable: true },
    { id: 'revenue', header: 'Revenue', accessor: (r) => r.revenue, cell: (r) => formatCurrency(r.revenue), align: 'right' as const, sortable: true },
    { id: 'avgPrice', header: 'Avg Price', accessor: (r) => r.avgPrice, cell: (r) => formatCurrency(r.avgPrice), align: 'right' as const, sortable: true },
    { id: 'rating', header: 'Rating', accessor: (r) => r.ratingAverage, cell: (r) => r.ratingAverage.toFixed(1), align: 'right' as const },
  ], []);

  return (
    <div className={styles.tabContent}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Customers" value={formatNumber(customers.totalCustomers)} chartColor="theme" />
        <StatCard label="Active" value={formatNumber(customers.activeCustomers)} chartColor="success" />
        <StatCard label="Avg Bookings/Customer" value={customers.avgBookingsPerCustomer.toFixed(0)} chartColor="info" />
        <StatCard label="Avg Revenue/Customer" value={formatCurrency(customers.avgRevenuePerCustomer)} chartColor="warning" />
      </div>

      <h3 className={styles.sectionTitle}>Customer Activity</h3>
      <EnterpriseDataTable<CustomerRow>
        data={customers.customers}
        columns={columns}
        stickyHeader
        striped
        ariaLabel="Customer activity"
        emptyState="No customer data available"
      />
    </div>
  );
}
