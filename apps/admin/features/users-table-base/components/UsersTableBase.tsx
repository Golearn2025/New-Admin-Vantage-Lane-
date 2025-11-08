/**
 * UsersTableBase Component
 * 
 * Reusable table component for all user types
 * Includes: Bulk selection, Create modal, Search, Pagination
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  EnterpriseDataTable,
  useSelection,
  useSorting,
  useColumnResize,
  Input,
  TableActions,
  Pagination,
  ConfirmDialog,
  Button,
} from '@vantage-lane/ui-core';
import { UserCreateModal } from '@features/user-create-modal';
import { UserViewModal } from '@features/user-view-modal';
import { UserEditModal } from '@features/user-edit-modal';
import { useAllUsers } from '@features/users-table/hooks/useAllUsers';
import { getAllUsersColumns } from '@features/users-table/columns/commonColumns';
import { bulkUpdateUsers, bulkDeleteUsers } from '@entities/user';
import { BulkActionsBar } from './BulkActionsBar';
import type { UsersTableBaseProps } from '../types';
import type { UnifiedUser } from '@entities/user';
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
  const [deleteUser, setDeleteUser] = useState<UnifiedUser | null>(null);
  const [viewUser, setViewUser] = useState<UnifiedUser | null>(null);
  const [editUser, setEditUser] = useState<UnifiedUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  // Initialize hooks for EnterpriseDataTable (after paginatedData is defined)
  const selection = useSelection<UnifiedUser>({
    data: paginatedData,
    getRowId: (user) => user.id,
  });
  const sorting = useSorting();
  const resize = useColumnResize();

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get selected user IDs from selection hook
  const selectedUserIds = Array.from(selection.selectedRows).map((user) => user.id);
  const selectedCount = selectedUserIds.length;

  const handleBulkDelete = () => {
    setBulkAction('delete');
  };

  const handleBulkActivate = () => {
    setBulkAction('activate');
  };

  const handleBulkDeactivate = () => {
    setBulkAction('deactivate');
  };

  const confirmBulkAction = useCallback(async () => {
    if (!bulkAction) return;

    setIsProcessing(true);
    const userIds = selectedUserIds;

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
      selection.clearSelection();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  }, [bulkAction, selectedUserIds, userType, refetch, selection]);

  // Get columns (no need for manual checkbox column - selection hook handles it)
  const columns = useMemo(
    () => {
      const cols = getAllUsersColumns({
        onView: (user: UnifiedUser) => setViewUser(user),
        onEdit: (user: UnifiedUser) => setEditUser(user),
        onDelete: (user: UnifiedUser) => setDeleteUser(user),
      });
      return cols;
    },
    []
  );

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
              onRefresh={refetch}
              loading={loading}
              addLabel={createLabel}
              showExport={false}
            />
          )}
          {!showCreateButton && (
            <TableActions
              onRefresh={refetch}
              loading={loading}
              showExport={false}
            />
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedCount}
        onActivate={handleBulkActivate}
        onDeactivate={handleBulkDeactivate}
        onDelete={handleBulkDelete}
      />

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
            <EnterpriseDataTable
              data={paginatedData}
              columns={columns}
              selection={selection}
              sorting={sorting}
              resize={resize}
              stickyHeader={true}
              maxHeight="calc(100vh - 400px)"
              striped={true}
              ariaLabel="Users table"
            />
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

      {/* Individual Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={async () => {
          if (!deleteUser) return;
          try {
            if (userType !== 'all') {
              await bulkDeleteUsers({ userIds: [deleteUser.id], userType });
              alert(`✅ User deleted successfully!`);
              await refetch();
            } else {
              alert('⚠️ Cannot delete from "All Users" view. Use specific user type pages.');
            }
          } catch (error) {
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
          } finally {
            setDeleteUser(null);
          }
        }}
        title="Delete User"
        message={`⚠️ Soft delete ${deleteUser?.name}? User data will be preserved for audit.`}
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
            ? `⚠️ Soft delete ${selectedCount} user(s)? They will be marked as deleted but data will be preserved for audit.`
            : bulkAction === 'activate'
            ? `Activate ${selectedCount} user(s)? They will be able to login and use the system.`
            : `Deactivate ${selectedCount} user(s)? They won't be able to login until reactivated.`
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

      {/* View User Modal */}
      <UserViewModal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        user={viewUser}
      />

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSuccess={() => {
          setEditUser(null);
          refetch();
        }}
        user={editUser}
      />
    </div>
  );
}
