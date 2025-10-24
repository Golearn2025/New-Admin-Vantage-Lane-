'use client';

/**
 * Users Table Component - Premium Edition
 * With pagination, search, actions, row menu
 */

import { useState } from 'react';
import { useUsersList } from '../hooks/useUsersList';
import { useUsersTableState } from '../hooks/useUsersTableState';
import { UsersTableHeader } from './UsersTableHeader';
import {
  DataTable,
  Pagination,
  RowActions,
  ConfirmDialog,
  UserBadge,
  type Column,
  type RowAction,
} from '@vantage-lane/ui-core';
import type { User } from '@entities/user';
import styles from './UsersTable.module.css';

export function UsersTable() {
  const { data, loading, error, refetch } = useUsersList();
  const tableState = useUsersTableState({ data });
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers
  const handleAdd = () => console.log('TODO: Add user modal');
  const handleExport = () => console.log('TODO: Export CSV');
  
  const handleDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      // TODO: API call to delete user
      console.log('Delete:', deleteUser.id);
      await new Promise((r) => setTimeout(r, 1000));
      setDeleteUser(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  // Columns with row actions
  const columns: Column<User>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      cell: (row) => (
        <div className={styles.nameCell}>
          <span className={styles.userName}>
            {row.firstName} {row.lastName}
          </span>
          <span className={styles.userEmail}>{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (row) => row.role,
      cell: (row) => <UserBadge type={row.role} />,
      sortable: true,
    },
    {
      id: 'created',
      header: 'Created',
      accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      id: 'actions',
      header: '',
      accessor: () => '',
      cell: (row) => {
        const actions: RowAction[] = [
          {
            label: 'View Details',
            icon: 'eye',
            onClick: () => console.log('View:', row.id),
          },
          {
            label: 'Edit',
            icon: 'edit',
            onClick: () => console.log('Edit:', row.id),
          },
          {
            label: 'Delete',
            icon: 'trash',
            onClick: () => setDeleteUser(row),
            variant: 'danger',
          },
        ];
        return <RowActions actions={actions} />;
      },
    },
  ];

  if (loading && !data.length) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <UsersTableHeader
        searchQuery={tableState.searchQuery}
        onSearchChange={tableState.handleSearch}
        onAdd={handleAdd}
        onExport={handleExport}
        onRefresh={refetch}
        loading={loading}
      />

      <DataTable
        data={tableState.paginatedData}
        columns={columns}
        loading={loading}
      />

      {tableState.filteredData.length > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={tableState.currentPage}
            totalPages={tableState.totalPages}
            totalItems={tableState.filteredData.length}
            pageSize={tableState.pageSize}
            onPageChange={tableState.setCurrentPage}
            onPageSizeChange={tableState.handlePageSizeChange}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Delete ${deleteUser?.firstName} ${deleteUser?.lastName}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
