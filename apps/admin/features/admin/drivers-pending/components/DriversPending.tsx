/**
 * DriversPending Component
 * 
 * Table showing drivers pending verification
 * With document status and quick actions
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EnterpriseDataTable,
  useSelection,
  useSorting,
  useColumnResize,
  Button 
} from '@vantage-lane/ui-core';
import { useDriversPending } from '../hooks/useDriversPending';
import { getPendingDriversColumns } from '../columns/pendingDriversColumns';
import type { PendingDriver } from '../types';
import styles from './DriversPending.module.css';

export function DriversPending() {
  const router = useRouter();
  const { drivers, loading, error, refetch } = useDriversPending();
  
  // Initialize hooks for EnterpriseDataTable
  const selection = useSelection<PendingDriver>({
    data: drivers,
    getRowId: (driver) => driver.id,
  });
  const sorting = useSorting();
  const resize = useColumnResize();

  const handleView = (driver: PendingDriver) => {
    // Navigate to driver profile page (with all tabs)
    router.push(`/users/drivers/${driver.id}`);
  };

  const handleVerify = (driver: PendingDriver) => {
    // Navigate to driver profile page with documents tab
    router.push(`/users/drivers/${driver.id}?tab=documents`);
  };

  const columns = getPendingDriversColumns({
    onView: handleView,
    onVerify: handleVerify,
  });

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading pending drivers: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pending Driver Verifications</h1>
          <p className={styles.subtitle}>
            {drivers.length} driver{drivers.length !== 1 ? 's' : ''} waiting for verification
          </p>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading pending drivers...</p>
        </div>
      )}

      {!loading && drivers.length === 0 && (
        <div className={styles.empty}>
          <p>✅ No pending driver verifications</p>
          <span>All drivers are up to date!</span>
        </div>
      )}

      {!loading && drivers.length > 0 && (
        <div className={styles.tableContainer}>
          <EnterpriseDataTable
            data={drivers}
            columns={columns}
            selection={selection}
            sorting={sorting}
            resize={resize}
            stickyHeader={true}
            maxHeight="calc(100vh - 300px)"
            striped={true}
            ariaLabel="Pending drivers table"
          />
        </div>
      )}
    </div>
  );
}
