/**
 * DriversFleetTab — Driver performance + fleet inventory
 *
 * REGULA 8: EnterpriseDataTable | REGULA 11: < 200 lines
 */

'use client';

import type { BIData, DriverRow, VehicleRow } from '@entities/business-intelligence';
import { capitalize, formatNumber, formatPercent } from '@entities/business-intelligence';
import type { Column } from '@vantage-lane/ui-core';
import { Badge, EnterpriseDataTable, StatCard } from '@vantage-lane/ui-core';
import { useMemo } from 'react';
import styles from './BIPage.module.css';

interface Props { data: BIData }

function warningColor(level: string): 'danger' | 'warning' | 'success' | 'neutral' {
  if (level === 'critical') return 'danger';
  if (level === 'warning') return 'warning';
  return 'success';
}

export function DriversFleetTab({ data }: Props) {
  const { drivers, fleet } = data;

  const driverCols: Column<DriverRow>[] = useMemo(() => [
    { id: 'name', header: 'Driver', accessor: (r) => r.name, cell: (r) => r.name, width: '160px' },
    { id: 'status', header: 'Status', accessor: (r) => r.status, cell: (r) => <Badge color={r.status === 'active' ? 'success' : 'neutral'} size="sm" variant="solid">{capitalize(r.status)}</Badge>, width: '100px' },
    { id: 'online', header: 'Online', accessor: (r) => r.onlineStatus, cell: (r) => <Badge color={r.onlineStatus === 'online' ? 'success' : 'neutral'} size="sm">{r.onlineStatus}</Badge>, width: '90px' },
    { id: 'rating', header: 'Rating', accessor: (r) => r.ratingAverage, cell: (r) => r.ratingAverage.toFixed(1), align: 'right' as const, sortable: true },
    { id: 'completed', header: 'Completed', accessor: (r) => r.totalCompleted, cell: (r) => formatNumber(r.totalCompleted), align: 'right' as const, sortable: true },
    { id: 'cancellations', header: 'Cancellations', accessor: (r) => r.totalCancellations, cell: (r) => formatNumber(r.totalCancellations), align: 'right' as const, sortable: true },
    { id: 'completion', header: 'Completion %', accessor: (r) => r.completionRate, cell: (r) => formatPercent(r.completionRate), align: 'right' as const, sortable: true },
    { id: 'warning', header: 'Warning', accessor: (r) => r.warningLevel, cell: (r) => <Badge color={warningColor(r.warningLevel)} size="sm" variant="solid">{capitalize(r.warningLevel)}</Badge>, width: '100px' },
  ], []);

  const vehicleCols: Column<VehicleRow>[] = useMemo(() => [
    { id: 'category', header: 'Category', accessor: (r) => r.category, cell: (r) => capitalize(r.category), width: '100px' },
    { id: 'make', header: 'Make', accessor: (r) => r.make, cell: (r) => r.make, width: '120px' },
    { id: 'model', header: 'Model', accessor: (r) => r.model, cell: (r) => r.model, width: '120px' },
    { id: 'year', header: 'Year', accessor: (r) => r.year, cell: (r) => String(r.year), align: 'right' as const, sortable: true },
    { id: 'capacity', header: 'Seats', accessor: (r) => r.capacity, cell: (r) => String(r.capacity), align: 'right' as const },
    { id: 'active', header: 'Active', accessor: (r) => r.isActive ? 1 : 0, cell: (r) => <Badge color={r.isActive ? 'success' : 'neutral'} size="sm">{r.isActive ? 'Yes' : 'No'}</Badge>, width: '80px' },
    { id: 'approval', header: 'Approval', accessor: (r) => r.approvalStatus, cell: (r) => <Badge color={r.approvalStatus === 'approved' ? 'success' : 'warning'} size="sm" variant="solid">{capitalize(r.approvalStatus)}</Badge>, width: '110px' },
  ], []);

  return (
    <div className={styles.tabContent}>
      <div className={styles.statsGrid}>
        <StatCard label="Total Drivers" value={formatNumber(drivers.totalDrivers)} chartColor="theme" />
        <StatCard label="Active" value={formatNumber(drivers.activeDrivers)} chartColor="success" />
        <StatCard label="Online Now" value={formatNumber(drivers.onlineNow)} chartColor="info" />
        <StatCard label="Avg Rating" value={drivers.avgRating.toFixed(1)} chartColor="warning" />
      </div>

      <h3 className={styles.sectionTitle}>Driver Leaderboard</h3>
      <EnterpriseDataTable<DriverRow>
        data={drivers.drivers}
        columns={driverCols}
        stickyHeader
        striped
        ariaLabel="Driver performance"
      />

      <div className={styles.statsGrid}>
        <StatCard label="Total Vehicles" value={formatNumber(fleet.totalVehicles)} chartColor="theme" />
        <StatCard label="Active" value={formatNumber(fleet.activeVehicles)} chartColor="success" />
        <StatCard label="Pending Approval" value={formatNumber(fleet.pendingApproval)} chartColor="warning" />
        <StatCard label="Categories" value={formatNumber(fleet.categories.length)} chartColor="info" />
      </div>

      <h3 className={styles.sectionTitle}>Fleet Inventory</h3>
      <EnterpriseDataTable<VehicleRow>
        data={fleet.vehicles}
        columns={vehicleCols}
        stickyHeader
        striped
        ariaLabel="Fleet inventory"
      />
    </div>
  );
}
