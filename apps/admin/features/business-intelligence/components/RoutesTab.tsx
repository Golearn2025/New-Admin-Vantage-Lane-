/**
 * RoutesTab — Top routes + demand by time tables
 *
 * REGULA 8: EnterpriseDataTable | REGULA 11: < 200 lines
 */

'use client';

import type { BIData, DemandByHour, RouteData } from '@entities/business-intelligence';
import { formatCurrency, formatDuration, formatHour, formatMiles, formatNumber } from '@entities/business-intelligence';
import type { Column } from '@vantage-lane/ui-core';
import { EnterpriseDataTable, StatCard } from '@vantage-lane/ui-core';
import { useMemo } from 'react';
import styles from './BIPage.module.css';

interface Props { data: BIData }

export function RoutesTab({ data }: Props) {
  const { routes } = data;

  const routeColumns: Column<RouteData>[] = useMemo(() => [
    { id: 'pickup', header: 'Pickup', accessor: (r) => r.pickup, cell: (r) => r.pickup, width: '220px' },
    { id: 'destination', header: 'Destination', accessor: (r) => r.destination, cell: (r) => r.destination, width: '220px' },
    { id: 'trips', header: 'Trips', accessor: (r) => r.trips, cell: (r) => formatNumber(r.trips), align: 'right' as const, sortable: true },
    { id: 'avgMiles', header: 'Avg Distance', accessor: (r) => r.avgMiles ?? 0, cell: (r) => formatMiles(r.avgMiles), align: 'right' as const, sortable: true },
    { id: 'avgDuration', header: 'Avg Duration', accessor: (r) => r.avgDuration ?? 0, cell: (r) => formatDuration(r.avgDuration), align: 'right' as const },
    { id: 'revenue', header: 'Revenue', accessor: (r) => r.revenue, cell: (r) => formatCurrency(r.revenue), align: 'right' as const, sortable: true },
    { id: 'avgPrice', header: 'Avg Price', accessor: (r) => r.avgPrice, cell: (r) => formatCurrency(r.avgPrice), align: 'right' as const, sortable: true },
  ], []);

  const demandColumns: Column<DemandByHour>[] = useMemo(() => [
    { id: 'day', header: 'Day', accessor: (r) => r.dayName, cell: (r) => r.dayName, width: '120px', sortable: true },
    { id: 'hour', header: 'Hour', accessor: (r) => r.hour, cell: (r) => formatHour(r.hour), width: '100px', sortable: true },
    { id: 'bookings', header: 'Bookings', accessor: (r) => r.bookings, cell: (r) => formatNumber(r.bookings), align: 'right' as const, sortable: true },
  ], []);

  return (
    <div className={styles.tabContent}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Legs" value={formatNumber(routes.totalLegs)} chartColor="theme" />
        <StatCard label="Avg Distance" value={formatMiles(routes.avgDistance)} chartColor="info" />
        <StatCard label="Avg Duration" value={formatDuration(routes.avgDuration)} chartColor="warning" />
        <StatCard label="Leg Revenue" value={formatCurrency(routes.totalLegRevenue)} chartColor="success" />
      </div>

      <h3 className={styles.sectionTitle}>Top Routes by Revenue</h3>
      <EnterpriseDataTable<RouteData>
        data={routes.topRoutes}
        columns={routeColumns}
        stickyHeader
        striped
        ariaLabel="Top routes"
        emptyState="No route data available"
      />

      <h3 className={styles.sectionTitle}>Demand by Day & Hour</h3>
      <EnterpriseDataTable<DemandByHour>
        data={routes.demandByTime.slice(0, 20)}
        columns={demandColumns}
        stickyHeader
        striped
        ariaLabel="Demand by time"
      />
    </div>
  );
}
