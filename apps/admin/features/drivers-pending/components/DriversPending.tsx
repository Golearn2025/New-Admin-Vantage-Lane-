/**
 * DriversPending Component
 * 
 * Table showing drivers pending verification
 * With document status and quick actions
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button } from '@vantage-lane/ui-core';
import { useDriversPending } from '../hooks/useDriversPending';
import { getPendingDriversColumns } from '../columns/pendingDriversColumns';
import type { PendingDriver } from '../types';
import styles from './DriversPending.module.css';

export function DriversPending() {
  const { drivers, loading, error, refetch } = useDriversPending();
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());

  const handleView = (driver: PendingDriver) => {
    window.location.href = `/users/drivers/${driver.id}/verify`;
  };

  const handleVerify = (driver: PendingDriver) => {
    window.location.href = `/users/drivers/${driver.id}/verify`;
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
          <DataTable data={drivers} columns={columns} />
        </div>
      )}
    </div>
  );
}
