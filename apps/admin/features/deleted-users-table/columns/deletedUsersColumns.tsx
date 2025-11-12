/**
 * Deleted Users Columns
 * Column definitions for deleted users table
 * 100% design tokens
 */

import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import type { Column } from '@vantage-lane/ui-core';
import type { UnifiedUser } from '@entities/user';
import { Badge } from '@vantage-lane/ui-core';
import styles from './deletedUsersColumns.module.css';

export interface DeletedUsersColumnsCallbacks {
  onRestore?: (ids: string[]) => void;
  onHardDelete?: (ids: string[]) => void;
}

export function getDeletedUsersColumns(
  callbacks: DeletedUsersColumnsCallbacks = {}
): Column<UnifiedUser>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row.name,
      cell: (row) => (
        <span className={styles.name}>{row.name}</span>
      ),
      sortable: true,
      width: '200px',
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (row) => row.email,
      cell: (row) => (
        <span className={styles.email}>{row.email}</span>
      ),
      sortable: true,
      width: '250px',
    },
    {
      id: 'userType',
      header: 'Type',
      accessor: (row) => row.userType,
      cell: (row) => {
        const typeColors = {
          customer: 'info' as const,
          driver: 'success' as const,
          operator: 'warning' as const,
          admin: 'danger' as const,
        };
        
        return (
          <Badge color={typeColors[row.userType]} size="sm">
            {row.userType}
          </Badge>
        );
      },
      sortable: true,
      width: '120px',
    },
    {
      id: 'deletedAt',
      header: 'Deleted',
      accessor: (row) => row.deletedAt || '',
      cell: (row) => {
        if (!row.deletedAt) return '—';
        
        const date = new Date(row.deletedAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeAgo = '';
        if (diffMins < 1) {
          timeAgo = 'Just now';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
          timeAgo = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        }
        
        return (
          <span className={styles.deletedAt} title={date.toLocaleString()}>
            {timeAgo}
          </span>
        );
      },
      sortable: true,
      width: '150px',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) => (
        <div className={styles.actions}>
          {callbacks.onRestore && (
            <button
              type="button"
              onClick={() => callbacks.onRestore?.([row.id])}
              className={`${styles.actionButton} ${styles.actionRestore}`}
              title="Restore"
            >
              <RotateCcw size={16} />
            </button>
          )}
          {callbacks.onHardDelete && (
            <button
              type="button"
              onClick={() => callbacks.onHardDelete?.([row.id])}
              className={`${styles.actionButton} ${styles.actionDelete}`}
              title="Delete Forever"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
      sortable: false,
      width: '100px',
    },
  ];
}
