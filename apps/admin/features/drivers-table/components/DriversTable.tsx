/**
 * DriversTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button, Input } from '@vantage-lane/ui-core';
import { useDriversTable } from '../hooks/useDriversTable';
import { getDriverColumns } from '../columns/driverColumns';
import styles from './DriversTable.module.css';

export interface DriversTableProps {
  className?: string;
}

export function DriversTable({ className }: DriversTableProps) {
  const { data, loading, error } = useDriversTable();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter drivers based on search query
  const filteredData = data.filter((driver) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${driver.firstName || ''} ${driver.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      driver.email.toLowerCase().includes(searchLower) ||
      (driver.phone && driver.phone.toLowerCase().includes(searchLower))
    );
  });

  const columns = getDriverColumns();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Drivers</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} drivers`}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Search input */}
          <Input
            type="search"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {/* Create driver button - placeholder for future */}
          <Button variant="primary" size="md" disabled>
            + Add Driver
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading drivers...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className={styles.tableContainer}>
          <DataTable
            data={filteredData}
            columns={columns}
          />
        </div>
      )}
    </div>
  );
}
