/**
 * Deleted Users Table Component
 * Shows soft-deleted users with restore/hard delete actions
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useCallback, useMemo } from 'react';
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

  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(() => getDeletedUsersColumns({
    onRestore: handleRestore,
    onHardDelete: handleHardDelete,
  }), [handleRestore, handleHardDelete]);

  // Memoize selection calculations
  const selectedCount = selection.selectedRows.length;
  const hasSelection = selectedCount > 0;
  const selectedIds = useMemo(() => 
    selection.selectedRows.map(user => user.id), 
    [selection.selectedRows]
  );

  // Optimized handlers with useCallback
  const handleBulkRestore = useCallback(() => {
    handleRestore(selectedIds);
    selection.clearSelection();
  }, [selectedIds, handleRestore, selection.clearSelection]);

  const handleBulkDelete = useCallback(() => {
    handleHardDelete(selectedIds);
    selection.clearSelection();
  }, [selectedIds, handleHardDelete, selection.clearSelection]);

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
                onClick={handleBulkRestore}
                leftIcon={<RotateCcw size={16} />}
              >
                Restore ({selectedCount})
              </Button>
              <Button
                variant="danger"
                onClick={handleBulkDelete}
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
