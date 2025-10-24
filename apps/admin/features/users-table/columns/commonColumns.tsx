/**
 * Users Table - Common Columns
 * 
 * Column definitions for All Users table
 * Displays common fields across all user types
 */

import React from 'react';
import type { UnifiedUser } from '@entities/user';
import { UserTypeBadge } from '../components/UserTypeBadge';
import styles from './commonColumns.module.css';

export interface UsersColumn {
  id: string;
  header: string;
  accessor: (row: UnifiedUser) => React.ReactNode | string;
  sortable?: boolean;
  width?: string;
}

/**
 * Get user type column with badge
 */
export function getTypeColumn(): UsersColumn {
  return {
    id: 'type',
    header: 'Type',
    accessor: (row: UnifiedUser) => (
      <UserTypeBadge type={row.userType} size="sm" />
    ),
    sortable: true,
    width: '120px',
  };
}

/**
 * Get name column
 */
export function getNameColumn(): UsersColumn {
  return {
    id: 'name',
    header: 'Name',
    accessor: (row: UnifiedUser) => (
      <span className={styles.name}>{row.name}</span>
    ),
    sortable: true,
    width: '200px',
  };
}

/**
 * Get email column
 */
export function getEmailColumn(): UsersColumn {
  return {
    id: 'email',
    header: 'Email',
    accessor: (row: UnifiedUser) => (
      <span className={styles.email}>{row.email}</span>
    ),
    sortable: true,
    width: '250px',
  };
}

/**
 * Get phone column
 */
export function getPhoneColumn(): UsersColumn {
  return {
    id: 'phone',
    header: 'Phone',
    accessor: (row: UnifiedUser) => (
      <span className={styles.phone}>{row.phone || '—'}</span>
    ),
    sortable: false,
    width: '150px',
  };
}

/**
 * Get status column
 */
export function getStatusColumn(): UsersColumn {
  return {
    id: 'status',
    header: 'Status',
    accessor: (row: UnifiedUser) => (
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
export function getCreatedColumn(): UsersColumn {
  return {
    id: 'created',
    header: 'Created',
    accessor: (row: UnifiedUser) => {
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
export function getAllUsersColumns(): UsersColumn[] {
  return [
    getTypeColumn(),
    getNameColumn(),
    getEmailColumn(),
    getPhoneColumn(),
    getStatusColumn(),
    getCreatedColumn(),
  ];
}
