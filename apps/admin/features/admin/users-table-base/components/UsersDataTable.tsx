/**
 * UsersDataTable Component - PERFORMANCE OPTIMIZED
 * 
 * Enterprise data table with pagination for users
 * Memoized to prevent unnecessary re-renders on parent state changes
 */

'use client';

import React, { memo, useMemo } from 'react';
import {
  EnterpriseDataTable,
  useSelection,
  useSorting, 
  useColumnResize,
  Pagination,
} from '@vantage-lane/ui-core';
import { getAllUsersColumns } from '@features/admin/users-table/columns/commonColumns';
import type { UnifiedUser } from '@entities/user';
import styles from './UsersTableBase.module.css';

interface UsersDataTableProps {
  paginatedData: UnifiedUser[];
  filteredData: UnifiedUser[];
  userType: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  selection: ReturnType<typeof useSelection<UnifiedUser>>;
  sorting: ReturnType<typeof useSorting>;
  resize: ReturnType<typeof useColumnResize>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewUser: (user: UnifiedUser) => void;
  onEditUser: (user: UnifiedUser) => void;
  onDeleteUser: (user: UnifiedUser) => void;
  onViewCustom?: (user: UnifiedUser) => void;
}

const UsersDataTableComponent = ({
  paginatedData,
  filteredData,
  userType,
  currentPage,
  pageSize,
  totalPages,
  loading,
  selection,
  sorting,
  resize,
  onPageChange,
  onPageSizeChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onViewCustom,
}: UsersDataTableProps) => {
  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(
    () => getAllUsersColumns({
      onView: (user: UnifiedUser) => onViewCustom ? onViewCustom(user) : onViewUser(user),
      onEdit: onEditUser,
      onDelete: onDeleteUser,
    }),
    [onViewCustom, onViewUser, onEditUser, onDeleteUser]
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <EnterpriseDataTable
          data={paginatedData}
          columns={columns}
          selection={selection}
          sorting={sorting}
          resize={resize}
          stickyHeader={true}
        />
      </div>

      {filteredData.length > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </div>
      )}
    </>
  );
};

// Export memoized component for performance optimization
export const UsersDataTable = memo(UsersDataTableComponent);
