/**
 * MoneyTab — Revenue by category + trip type tables
 *
 * REGULA 8: EnterpriseDataTable | REGULA 11: < 200 lines
 */

'use client';

import React, { useMemo } from 'react';
import { StatCard, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { BIData, CategoryRevenue, TripTypeRevenue } from '@entities/business-intelligence';
import { formatCurrency, formatNumber, formatPercent, capitalize } from '@entities/business-intelligence';
import styles from './BIPage.module.css';

interface Props { data: BIData }

export function MoneyTab({ data }: Props) {
  const { revenue } = data;

  const catColumns: Column<CategoryRevenue>[] = useMemo(() => [
    { id: 'category', header: 'Category', accessor: (r) => r.category, cell: (r) => capitalize(r.category), width: '120px' },
    { id: 'legs', header: 'Legs', accessor: (r) => r.legs, cell: (r) => formatNumber(r.legs), align: 'right' as const, sortable: true },
    { id: 'revenue', header: 'Revenue', accessor: (r) => r.revenue, cell: (r) => formatCurrency(r.revenue), align: 'right' as const, sortable: true },
    { id: 'avgPrice', header: 'Avg Price', accessor: (r) => r.avgPrice, cell: (r) => formatCurrency(r.avgPrice), align: 'right' as const, sortable: true },
    { id: 'payout', header: 'Driver Payout', accessor: (r) => r.driverPayout, cell: (r) => formatCurrency(r.driverPayout), align: 'right' as const },
    { id: 'profit', header: 'Platform Profit', accessor: (r) => r.platformProfit, cell: (r) => formatCurrency(r.platformProfit), align: 'right' as const, sortable: true },
    { id: 'margin', header: 'Margin', accessor: (r) => r.marginPct, cell: (r) => formatPercent(r.marginPct), align: 'right' as const, sortable: true },
  ], []);

  const tripColumns: Column<TripTypeRevenue>[] = useMemo(() => [
    { id: 'tripType', header: 'Trip Type', accessor: (r) => r.tripType, cell: (r) => capitalize(r.tripType), width: '120px' },
    { id: 'category', header: 'Category', accessor: (r) => r.category, cell: (r) => capitalize(r.category), width: '100px' },
    { id: 'bookings', header: 'Bookings', accessor: (r) => r.bookings, cell: (r) => formatNumber(r.bookings), align: 'right' as const, sortable: true },
    { id: 'revenue', header: 'Revenue', accessor: (r) => r.revenue, cell: (r) => formatCurrency(r.revenue), align: 'right' as const, sortable: true },
    { id: 'avgPrice', header: 'Avg Price', accessor: (r) => r.avgPrice, cell: (r) => formatCurrency(r.avgPrice), align: 'right' as const, sortable: true },
    { id: 'fee', header: 'Platform Fee', accessor: (r) => r.platformFee, cell: (r) => formatCurrency(r.platformFee), align: 'right' as const },
  ], []);

  return (
    <div className={styles.tabContent}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Revenue" value={formatCurrency(revenue.totalRevenue)} chartColor="success" />
        <StatCard label="Platform Fees" value={formatCurrency(revenue.totalPlatformFees)} chartColor="theme" />
        <StatCard label="Driver Payouts" value={formatCurrency(revenue.totalDriverPayouts)} chartColor="warning" />
        <StatCard label="Avg Margin" value={formatPercent(revenue.avgMargin)} chartColor="info" />
      </div>

      <h3 className={styles.sectionTitle}>Revenue by Vehicle Category</h3>
      <EnterpriseDataTable<CategoryRevenue>
        data={revenue.byCategory}
        columns={catColumns}
        stickyHeader
        striped
        ariaLabel="Revenue by category"
      />

      <h3 className={styles.sectionTitle}>Revenue by Trip Type</h3>
      <EnterpriseDataTable<TripTypeRevenue>
        data={revenue.byTripType}
        columns={tripColumns}
        stickyHeader
        striped
        ariaLabel="Revenue by trip type"
      />
    </div>
  );
}
