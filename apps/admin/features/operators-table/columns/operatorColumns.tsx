/**
 * Operators Table - Column Definitions
 *
 * Column definitions for Operators table
 * Displays operator information
 */

import React from 'react';
import type { OperatorData } from '@entities/operator';
import type { Column } from '@vantage-lane/ui-core';
import styles from './operatorColumns.module.css';

/**
 * Get name column (organization name)
 */
export function getNameColumn(): Column<OperatorData> {
  return {
    id: 'name',
    header: 'Organization',
    accessor: (row) => row.name,
    cell: (row) => <span className={styles.name}>{row.name}</span>,
    sortable: true,
    width: '250px',
  };
}

/**
 * Get email column (contact email)
 */
export function getEmailColumn(): Column<OperatorData> {
  return {
    id: 'email',
    header: 'Contact Email',
    accessor: (row) => row.contactEmail || '—',
    cell: (row) => <span className={styles.email}>{row.contactEmail || '—'}</span>,
    sortable: true,
    width: '220px',
  };
}

/**
 * Get city column
 */
export function getCityColumn(): Column<OperatorData> {
  return {
    id: 'city',
    header: 'City',
    accessor: (row) => row.city || '—',
    cell: (row) => <span className={styles.city}>{row.city || '—'}</span>,
    sortable: true,
    width: '150px',
  };
}

/**
 * Get rating column
 */
export function getRatingColumn(): Column<OperatorData> {
  return {
    id: 'rating',
    header: 'Rating',
    accessor: (row) => row.ratingAverage?.toFixed(2) || '—',
    cell: (row) => (
      <span className={styles.rating}>
        {row.ratingAverage ? `⭐ ${row.ratingAverage.toFixed(2)}` : '—'}
      </span>
    ),
    sortable: true,
    width: '100px',
  };
}

/**
 * Get status column
 */
export function getStatusColumn(): Column<OperatorData> {
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
export function getCreatedColumn(): Column<OperatorData> {
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
 * Get all operator columns
 */
export function getOperatorColumns(): Column<OperatorData>[] {
  return [
    getNameColumn(),
    getEmailColumn(),
    getCityColumn(),
    getRatingColumn(),
    getStatusColumn(),
    getCreatedColumn(),
  ];
}
