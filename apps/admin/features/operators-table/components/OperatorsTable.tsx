/**
 * OperatorsTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button, Input } from '@vantage-lane/ui-core';
import { useOperatorsTable } from '../hooks/useOperatorsTable';
import { getOperatorColumns } from '../columns/operatorColumns';
import styles from './OperatorsTable.module.css';

export interface OperatorsTableProps {
  className?: string;
}

export function OperatorsTable({ className }: OperatorsTableProps) {
  const { data, loading, error } = useOperatorsTable();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter operators based on search query
  const filteredData = data.filter((operator) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${operator.firstName || ''} ${operator.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      operator.email.toLowerCase().includes(searchLower) ||
      (operator.phone && operator.phone.toLowerCase().includes(searchLower))
    );
  });

  const columns = getOperatorColumns();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Operators</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} operators`}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Search input */}
          <Input
            type="search"
            placeholder="Search operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {/* Create operator button - placeholder for future */}
          <Button variant="primary" size="md" disabled>
            + Add Operator
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading operators...</p>
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
