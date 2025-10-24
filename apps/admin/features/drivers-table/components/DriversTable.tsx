/**
 * DriversTable Component
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
  RowActions,
  ConfirmDialog,
  type RowAction,
} from '@vantage-lane/ui-core';
import { useDriversTable } from '../hooks/useDriversTable';
import { getDriverColumns } from '../columns/driverColumns';
import styles from './DriversTable.module.css';

export interface DriversTableProps {
  className?: string;
}

export function DriversTable({ className }: DriversTableProps) {
  const router = useRouter();
  const { data, loading, error, refetch } = useDriversTable();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteDriver, setDeleteDriver] = useState<any>(null);

  // Filter drivers based on search query
  const filteredData = useMemo(() => {
    return data.filter((driver) => {
      const query = searchQuery.toLowerCase();
      const fullName = `${driver.firstName || ''} ${driver.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        (driver.phone && driver.phone.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const columns = getDriverColumns({
    onView: (driver: any) => router.push(`/users/${driver.id}?type=driver`),
    onEdit: (driver: any) => console.log('Edit:', driver),
    onDelete: (driver: any) => setDeleteDriver(driver),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Drivers</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} drivers`}
          </span>
        </div>

        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          <TableActions
            onAdd={() => console.log('Add driver')}
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
            addLabel="Create Driver"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading drivers...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error loading drivers: {error}</p>
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
        isOpen={!!deleteDriver}
        onClose={() => setDeleteDriver(null)}
        onConfirm={async () => {
          console.log('Delete:', deleteDriver);
          setDeleteDriver(null);
        }}
        title="Delete Driver"
        message={`Delete ${deleteDriver?.firstName} ${deleteDriver?.lastName}?`}
        variant="danger"
      />
    </div>
  );
}
