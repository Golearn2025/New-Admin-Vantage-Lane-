/**
 * AllUsersTable Component
 * 
 * Displays all users (customers, drivers, admins, operators) in a unified table
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState } from 'react';
import { DataTable, Button, Input } from '@vantage-lane/ui-core';
import { useAllUsers } from '../hooks/useAllUsers';
import { getAllUsersColumns } from '../columns/commonColumns';
import styles from './AllUsersTable.module.css';

export function AllUsersTable() {
  const { data, loading, error } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredData = data.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.toLowerCase().includes(query))
    );
  });

  const columns = getAllUsersColumns();

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Error loading users: {error.message}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>All Users</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} users`}
          </span>
        </div>

        <div className={styles.headerRight}>
          {/* Search input */}
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {/* Create user button - placeholder for future */}
          <Button variant="primary" size="md" disabled>
            + Create User
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading users...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
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
