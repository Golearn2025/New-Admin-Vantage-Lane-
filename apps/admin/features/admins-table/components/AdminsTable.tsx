/**
 * AdminsTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button, Input } from '@vantage-lane/ui-core';
import { useAdminsTable } from '../hooks/useAdminsTable';
import { getAdminColumns } from '../columns/adminColumns';
import styles from './AdminsTable.module.css';

export interface AdminsTableProps {
  className?: string;
}

export function AdminsTable({ className }: AdminsTableProps) {
  const { data, loading, error } = useAdminsTable();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter admins based on search query
  const filteredData = data.filter((admin) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchLower))
    );
  });

  const columns = getAdminColumns();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admins</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} admins`}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Search input */}
          <Input
            type="search"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {/* Create admin button - placeholder for future */}
          <Button variant="primary" size="md" disabled>
            + Add Admin
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading admins...</p>
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
