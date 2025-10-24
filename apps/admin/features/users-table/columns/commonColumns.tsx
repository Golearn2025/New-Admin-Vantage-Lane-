/**
 * Users Table - Common Columns
 * 
 * Column definitions for All Users table
 * Displays common fields across all user types
 */

import React from 'react';
import type { UnifiedUser } from '@entities/user';
import type { Column } from '@vantage-lane/ui-core';
import { UserTypeBadge } from '../components/UserTypeBadge';
import styles from './commonColumns.module.css';

/**
 * Get user type column with badge
 */
export function getTypeColumn(): Column<UnifiedUser> {
  return {
    id: 'type',
    header: 'Type',
    accessor: (row) => row.userType,
    cell: (row) => <UserTypeBadge type={row.userType} size="sm" />,
    sortable: true,
    width: '120px',
  };
}

/**
 * Get name column
 */
export function getNameColumn(): Column<UnifiedUser> {
  return {
    id: 'name',
    header: 'Name',
    accessor: (row) => row.name,
    cell: (row) => <span className={styles.name}>{row.name}</span>,
    sortable: true,
    width: '200px',
  };
}

/**
 * Get email column
 */
export function getEmailColumn(): Column<UnifiedUser> {
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
export function getPhoneColumn(): Column<UnifiedUser> {
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
export function getStatusColumn(): Column<UnifiedUser> {
  return {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    cell: (row) => (
      <span 
        className={
          row.status === 'active' 
            ? styles.statusActive 
            : styles.statusInactive
        }
      >
        {row.status === 'active' ? 'Active' : 'Inactive'}
      </span>
    ),
    sortable: true,
    width: '100px',
  };
}

/**
 * Get created date column
 */
export function getCreatedColumn(): Column<UnifiedUser> {
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
 * Get all common columns for All Users table
 */
export function getAllUsersColumns(): Column<UnifiedUser>[] {
  return [
    getTypeColumn(),
    getNameColumn(),
    getEmailColumn(),
    getPhoneColumn(),
    getStatusColumn(),
    getCreatedColumn(),
  ];
}
