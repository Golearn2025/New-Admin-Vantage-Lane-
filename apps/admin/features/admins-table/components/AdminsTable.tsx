/**
 * AdminsTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DataTable,
  Input,
  TableActions,
  Pagination,
  ConfirmDialog,
} from '@vantage-lane/ui-core';
import { useAdminsTable } from '../hooks/useAdminsTable';
import { getAdminColumns } from '../columns/adminColumns';
import styles from './AdminsTable.module.css';

export interface AdminsTableProps {
  className?: string;
}

export function AdminsTable({ className }: AdminsTableProps) {
  const router = useRouter();
  const { data, loading, error, refetch } = useAdminsTable();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteAdmin, setDeleteAdmin] = useState<any>(null);

  // Filter admins based on search query
  const filteredData = useMemo(() => {
    return data.filter((admin) => {
      const query = searchQuery.toLowerCase();
      const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        (admin.phone && admin.phone.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const columns = getAdminColumns({
    onView: (admin: any) => router.push(`/users/${admin.id}?type=admin`),
    onEdit: (admin: any) => console.log('Edit:', admin),
    onDelete: (admin: any) => setDeleteAdmin(admin),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admins</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} admins`}
          </span>
        </div>

        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          <TableActions
            onAdd={() => console.log('Add admin')}
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
            addLabel="Create Admin"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading admins...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error loading admins: {error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
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
        isOpen={!!deleteAdmin}
        onClose={() => setDeleteAdmin(null)}
        onConfirm={async () => {
          console.log('Delete:', deleteAdmin);
          setDeleteAdmin(null);
        }}
        title="Delete Admin"
        message={`Delete ${deleteAdmin?.firstName} ${deleteAdmin?.lastName}?`}
        variant="danger"
      />
    </div>
  );
}
