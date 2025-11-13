/**
 * Deleted Users Table Component
 * Shows soft-deleted users with restore/hard delete actions
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { EnterpriseDataTable, Button, useSelection } from '@vantage-lane/ui-core';
import { Trash2, RotateCcw } from 'lucide-react';
import { useDeletedUsersTable } from '../hooks/useDeletedUsersTable';
import { getDeletedUsersColumns } from '../columns/deletedUsersColumns';
import styles from './DeletedUsersTable.module.css';

export function DeletedUsersTable() {
  const {
    users,
    isLoading,
    handleRestore,
    handleHardDelete,
  } = useDeletedUsersTable();
  
  const selection = useSelection<typeof users[0]>({ data: users, getRowId: (user) => user.id });

  const columns = getDeletedUsersColumns({
    onRestore: handleRestore,
    onHardDelete: handleHardDelete,
  });

  const selectedCount = selection.selectedRows.length;
  const hasSelection = selectedCount > 0;
  const selectedIds = selection.selectedRows.map(user => user.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Trash2 size={24} className={styles.icon} />
            <div>
              <h1 className={styles.title}>Deleted Users</h1>
              <p className={styles.subtitle}>
                {users.length} user{users.length !== 1 ? 's' : ''} in trash
              </p>
            </div>
          </div>
          
          {hasSelection && (
            <div className={styles.bulkActions}>
              <Button
                variant="secondary"
                onClick={() => {
                  const ids = selection.selectedRows.map(u => u.id);
                  handleRestore(ids);
                  selection.clearSelection();
                }}
                leftIcon={<RotateCcw size={16} />}
              >
                Restore ({selectedCount})
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const ids = selection.selectedRows.map(u => u.id);
                  handleHardDelete(ids);
                  selection.clearSelection();
                }}
                leftIcon={<Trash2 size={16} />}
              >
                Delete Forever ({selectedCount})
              </Button>
            </div>
          )}
        </div>
      </div>

      <EnterpriseDataTable
        data={users}
        columns={columns}
        loading={isLoading}
        selection={selection}
        stickyHeader={true}
      />
    </div>
  );
}
