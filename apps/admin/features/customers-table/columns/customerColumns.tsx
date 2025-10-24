/**
 * Customers Table - Column Definitions
 *
 * Column definitions for Customers table
 * Displays customer information
 */

import React from 'react';
import type { CustomerData } from '@entities/customer';
import type { Column } from '@vantage-lane/ui-core';
import styles from './customerColumns.module.css';

/**
 * Get name column
 */
export function getNameColumn(): Column<CustomerData> {
  return {
    id: 'name',
    header: 'Name',
    accessor: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'No Name',
    cell: (row) => (
      <span className={styles.name}>
        {`${row.firstName || ''} ${row.lastName || ''}`.trim() || 'No Name'}
      </span>
    ),
    sortable: true,
    width: '200px',
  };
}

/**
 * Get email column
 */
export function getEmailColumn(): Column<CustomerData> {
  return {
    id: 'email',
    header: 'Email',
    accessor: (row) => row.email,
    cell: (row) => <span className={styles.email}>{row.email}</span>,
    sortable: true,
    width: '250px',
  };
}

/**
 * Get phone column
 */
export function getPhoneColumn(): Column<CustomerData> {
  return {
    id: 'phone',
    header: 'Phone',
    accessor: (row) => row.phone || '—',
    cell: (row) => <span className={styles.phone}>{row.phone || '—'}</span>,
    sortable: false,
    width: '150px',
  };
}

/**
 * Get status column
 */
export function getStatusColumn(): Column<CustomerData> {
  return {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.isActive ? 'active' : 'inactive',
    cell: (row) => (
      <span
        className={
          row.isActive
            ? styles.statusActive
            : styles.statusInactive
        }
      >
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
    sortable: true,
    width: '100px',
  };
}

/**
 * Get created date column
 */
export function getCreatedColumn(): Column<CustomerData> {
  return {
    id: 'created',
    header: 'Created',
    accessor: (row) => row.createdAt,
    cell: (row) => {
      const date = new Date(row.createdAt);
      return (
        <span className={styles.date}>
          {date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
    },
    sortable: true,
    width: '120px',
  };
}

/**
 * Get all customer columns
 */
export function getCustomerColumns(): Column<CustomerData>[] {
  return [
    getNameColumn(),
    getEmailColumn(),
    getPhoneColumn(),
    getStatusColumn(),
    getCreatedColumn(),
  ];
}
