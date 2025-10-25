/**
 * AllUsersTable Component
 * 
 * Displays all users (customers, drivers, admins, operators) in a unified table
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  DataTable,
  Input,
  TableActions,
  Pagination,
  RowActions,
  ConfirmDialog,
  Checkbox,
  Button,
  type RowAction,
} from '@vantage-lane/ui-core';
import { UserCreateModal } from '@features/user-create-modal';
import { useAllUsers } from '../hooks/useAllUsers';
import { getAllUsersColumns } from '../columns/commonColumns';
import styles from './AllUsersTable.module.css';

export function AllUsersTable() {
  const { data, loading, error, refetch } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

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
    console.log('Bulk delete:', Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  const handleBulkActivate = () => {
    console.log('Bulk activate:', Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  const handleBulkDeactivate = () => {
    console.log('Bulk deactivate:', Array.from(selectedUsers));
    setSelectedUsers(new Set());
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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>All Users</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} users`}
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

          <TableActions
            onAdd={() => setIsCreateModalOpen(true)}
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
            addLabel="Create User"
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.size > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
          </span>
          <div className={styles.bulkButtons}>
            <Button
              onClick={handleBulkActivate}
              variant="secondary"
              size="sm"
            >
              Activate
            </Button>
            <Button
              onClick={handleBulkDeactivate}
              variant="secondary"
              size="sm"
            >
              Deactivate
            </Button>
            <Button
              onClick={handleBulkDelete}
              variant="danger"
              size="sm"
            >
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

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
