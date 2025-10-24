/**
 * CustomersTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button, Input } from '@vantage-lane/ui-core';
import { useCustomersTable } from '../hooks/useCustomersTable';
import { getCustomerColumns } from '../columns/customerColumns';
import styles from './CustomersTable.module.css';

export interface CustomersTableProps {
  className?: string;
}

export function CustomersTable({ className }: CustomersTableProps) {
  const { data, loading, error } = useCustomersTable();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search query
  const filteredData = data.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchLower))
    );
  });

  const columns = getCustomerColumns();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Customers</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} customers`}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Search input */}
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {/* Create customer button - placeholder for future */}
          <Button variant="primary" size="md" disabled>
            + Add Customer
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading customers...</p>
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
