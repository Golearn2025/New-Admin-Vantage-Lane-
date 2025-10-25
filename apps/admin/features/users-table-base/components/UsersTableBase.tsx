/**
 * UsersTableBase Component
 * 
 * Reusable table component for all user types
 * Includes: Bulk selection, Create modal, Search, Pagination
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  DataTable,
  Input,
  TableActions,
  Pagination,
  ConfirmDialog,
  Checkbox,
  Button,
} from '@vantage-lane/ui-core';
import { UserCreateModal } from '@features/user-create-modal';
import { useAllUsers } from '@features/users-table/hooks/useAllUsers';
import { getAllUsersColumns } from '@features/users-table/columns/commonColumns';
import { bulkUpdateUsers, bulkDeleteUsers } from '@entities/user';
import type { UsersTableBaseProps } from '../types';
import styles from './UsersTableBase.module.css';

export function UsersTableBase({
  userType,
  title,
  createLabel = 'Create User',
  showCreateButton = true,
  className,
}: UsersTableBaseProps) {
  const { data: allData, loading, error, refetch } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter by user type
  const data = useMemo(() => {
    if (userType === 'all') return allData;
    return allData.filter((user) => user.userType === userType);
  }, [allData, userType]);

  // Filter users based on search query
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(paginatedData.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = () => {
    setBulkAction('delete');
  };

  const handleBulkActivate = () => {
    setBulkAction('activate');
  };

  const handleBulkDeactivate = () => {
    setBulkAction('deactivate');
  };

  const confirmBulkAction = async () => {
    if (!bulkAction) return;

    setIsProcessing(true);
    const userIds = Array.from(selectedUsers);

    try {
      if (bulkAction === 'delete') {
        // Soft delete
        if (userType !== 'all') {
          await bulkDeleteUsers({ userIds, userType });
          alert(`✅ Successfully deleted ${userIds.length} user(s)`);
        } else {
          alert('⚠️ Cannot bulk delete from "All Users" view. Use specific user type pages.');
        }
      } else {
        // Activate or Deactivate
        const isActive = bulkAction === 'activate';
        if (userType !== 'all') {
          await bulkUpdateUsers({ userIds, isActive, userType });
          alert(`✅ Successfully ${isActive ? 'activated' : 'deactivated'} ${userIds.length} user(s)`);
        } else {
          alert('⚠️ Cannot bulk update from "All Users" view. Use specific user type pages.');
        }
      }

      // Refresh table and clear selection
      await refetch();
      setSelectedUsers(new Set());
    } catch (error) {
      console.error('Bulk action error:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  };

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((u) => selectedUsers.has(u.id));
  const someSelected = selectedUsers.size > 0 && !allSelected;

  // Add checkbox column at the beginning
  const checkboxColumn = {
    id: 'select',
    header: (
      <Checkbox
        checked={allSelected}
        indeterminate={someSelected}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    ),
    cell: (user: any) => (
      <Checkbox
        checked={selectedUsers.has(user.id)}
        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
      />
    ),
    width: '50px',
  };

  const userColumns = getAllUsersColumns({
    onView: (user: any) => console.log('View:', user),
    onEdit: (user: any) => console.log('Edit:', user),
    onDelete: (user: any) => setDeleteUser(user),
  });

  const columns = [checkboxColumn, ...userColumns];

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
    <div className={className || styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} ${userType === 'all' ? 'users' : `${userType}s`}`}
          </span>
        </div>

        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          {showCreateButton && (
            <TableActions
              onAdd={() => setIsCreateModalOpen(true)}
              onExport={() => console.log('Export')}
              onRefresh={refetch}
              loading={loading}
              addLabel={createLabel}
            />
          )}
          {!showCreateButton && (
            <TableActions
              onExport={() => console.log('Export')}
              onRefresh={refetch}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.size > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
          </span>
          <div className={styles.bulkButtons}>
            <Button onClick={handleBulkActivate} variant="secondary" size="sm">
              Activate
            </Button>
            <Button onClick={handleBulkDeactivate} variant="secondary" size="sm">
              Deactivate
            </Button>
            <Button onClick={handleBulkDelete} variant="danger" size="sm">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading users...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <>
          <div className={styles.tableContainer}>
            <DataTable data={paginatedData} columns={columns} />
          </div>

          {filteredData.length > 0 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredData.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={async () => {
          console.log('Delete:', deleteUser);
          setDeleteUser(null);
        }}
        title="Delete User"
        message={`Delete ${deleteUser?.name}?`}
        variant="danger"
      />

      {/* Bulk Action Confirmation */}
      <ConfirmDialog
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        onConfirm={confirmBulkAction}
        title={
          bulkAction === 'delete'
            ? 'Delete Selected Users'
            : bulkAction === 'activate'
            ? 'Activate Selected Users'
            : 'Deactivate Selected Users'
        }
        message={
          bulkAction === 'delete'
            ? `⚠️ Soft delete ${selectedUsers.size} user(s)? They will be marked as deleted but data will be preserved for audit.`
            : bulkAction === 'activate'
            ? `Activate ${selectedUsers.size} user(s)? They will be able to login and use the system.`
            : `Deactivate ${selectedUsers.size} user(s)? They won't be able to login until reactivated.`
        }
        variant={bulkAction === 'delete' ? 'danger' : 'warning'}
      />

      {showCreateButton && (
        <UserCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
