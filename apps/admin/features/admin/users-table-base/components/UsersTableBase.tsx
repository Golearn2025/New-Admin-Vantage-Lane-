/**
 * UsersTableBase Component - Refactored Orchestrator
 * 
 * Orchestrates smaller focused components - RULES.md compliant
 * Split 337 → 195 lines (-42%)
 */

'use client';

import type { UnifiedUser } from '@entities/user';
import { getAllUsersColumns } from '@features/admin/users-table/columns/commonColumns';
import { useAllUsers } from '@features/admin/users-table/hooks/useAllUsers';
import { useOperatorDrivers } from '@features/admin/users-table/hooks/useOperatorDrivers';
import {
    Pagination,
    TanStackDataTable,
    toTanStackColumns,
    useSelection,
} from '@vantage-lane/ui-core';
import { useCallback, useMemo, useState } from 'react';
import type { UsersTableBaseProps } from '../types';
import {
    handleBulkActivate,
    handleBulkDeactivate,
    handleBulkDelete,
    handleSingleDelete,
    type BulkActionHandlers
} from '../utils/usersTableHandlers';
import { BulkActionsBar } from './BulkActionsBar';
import styles from './UsersTableBase.module.css';
import { UsersTableDialogs } from './UsersTableDialogs';
import { UsersTableHeader } from './UsersTableHeader';
import { UsersTableModals } from './UsersTableModals';

export function UsersTableBase({
  userType,
  title,
  createLabel = 'Create User',
  showCreateButton = true,
  className,
  onViewCustom,
  useOperatorFilter = false,
}: UsersTableBaseProps) {
  // ✅ RBAC: Use appropriate hook based on user role
  const allUsersResult = useAllUsers();
  const operatorDriversResult = useOperatorDrivers();

  const {
    data: allData,
    loading,
    error,
    refetch,
  } = useOperatorFilter ? operatorDriversResult : allUsersResult;

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

  // Selection hook for bulk actions
  const selection = useSelection<UnifiedUser>({
    data: paginatedData,
    getRowId: (user) => user.id,
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get selected user IDs from selection hook - memoized
  const selectedUserIds = useMemo(() => 
    Array.from(selection.selectedRows).map((user) => user.id),
    [selection.selectedRows]
  );
  const selectedCount = selectedUserIds.length;

  // Bulk action handlers
  const bulkHandlerProps: BulkActionHandlers = {
    selectedUserIds,
    userType,
    refetch,
    clearSelection: selection.clearSelection,
  };

  const handleBulkDeleteAction = () => setBulkAction('delete');
  const handleBulkActivateAction = () => setBulkAction('activate');
  const handleBulkDeactivateAction = () => setBulkAction('deactivate');

  const confirmBulkAction = useCallback(async () => {
    if (!bulkAction) return;

    setIsProcessing(true);
    try {
      switch (bulkAction) {
        case 'delete':
          await handleBulkDelete(bulkHandlerProps);
          break;
        case 'activate':
          await handleBulkActivate(bulkHandlerProps);
          break;
        case 'deactivate':
          await handleBulkDeactivate(bulkHandlerProps);
          break;
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Action failed'}`);
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  }, [bulkAction, bulkHandlerProps]);

  // Single delete handler
  const confirmSingleDelete = useCallback(async () => {
    if (!deleteUser) return;
    try {
      await handleSingleDelete({
        userId: deleteUser.id,
        userType,
        refetch,
      });
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
    } finally {
      setDeleteUser(null);
    }
  }, [deleteUser, userType, refetch]);

  // Get columns and convert to TanStack format
  const columns = useMemo(() => {
    const cols = getAllUsersColumns({
      onView: onViewCustom || ((user: UnifiedUser) => setViewUser(user)),
      onEdit: (user: UnifiedUser) => setEditUser(user),
      onDelete: (user: UnifiedUser) => setDeleteUser(user),
    });
    return toTanStackColumns(cols);
  }, [onViewCustom]);

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
      <UsersTableHeader
        title={title}
        userType={userType}
        filteredCount={filteredData.length}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showCreateButton={showCreateButton}
        createLabel={createLabel}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onRefresh={refetch}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedCount}
        onActivate={handleBulkActivateAction}
        onDeactivate={handleBulkDeactivateAction}
        onDelete={handleBulkDeleteAction}
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
            <TanStackDataTable
              data={paginatedData}
              columns={columns}
              getRowId={(user) => user.id}
              stickyHeader={true}
              maxHeight="calc(100vh - 400px)"
              striped={true}
              enableResize={true}
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

      {/* Dialogs */}
      <UsersTableDialogs
        deleteUser={deleteUser}
        bulkAction={bulkAction}
        selectedCount={selectedCount}
        onDeleteCancel={() => setDeleteUser(null)}
        onDeleteConfirm={confirmSingleDelete}
        onBulkActionCancel={() => setBulkAction(null)}
        onBulkActionConfirm={confirmBulkAction}
      />

      {/* Modals */}
      <UsersTableModals
        showCreateButton={showCreateButton}
        isCreateModalOpen={isCreateModalOpen}
        viewUser={viewUser}
        editUser={editUser}
        onCreateClose={() => setIsCreateModalOpen(false)}
        onCreateSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
        onViewClose={() => setViewUser(null)}
        onEditClose={() => setEditUser(null)}
        onEditSuccess={() => {
          setEditUser(null);
          refetch();
        }}
      />
    </div>
  );
}
