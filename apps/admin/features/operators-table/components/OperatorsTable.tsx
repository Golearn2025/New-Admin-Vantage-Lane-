/**
 * OperatorsTable Component
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
import { useOperatorsTable } from '../hooks/useOperatorsTable';
import { getOperatorColumns } from '../columns/operatorColumns';
import styles from './OperatorsTable.module.css';

export interface OperatorsTableProps {
  className?: string;
}

export function OperatorsTable({ className }: OperatorsTableProps) {
  const router = useRouter();
  const { data, loading, error, refetch } = useOperatorsTable();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteOperator, setDeleteOperator] = useState<any>(null);

  // Filter operators based on search query
  const filteredData = useMemo(() => {
    return data.filter((operator) => {
      const query = searchQuery.toLowerCase();
      return (
        operator.name.toLowerCase().includes(query) ||
        (operator.contactEmail && operator.contactEmail.toLowerCase().includes(query)) ||
        (operator.city && operator.city.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const columns = getOperatorColumns({
    onView: (operator: any) => router.push(`/users/${operator.id}?type=operator`),
    onEdit: (operator: any) => console.log('Edit:', operator),
    onDelete: (operator: any) => setDeleteOperator(operator),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Operators</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} operators`}
          </span>
        </div>

        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search operators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          <TableActions
            onAdd={() => console.log('Add operator')}
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
            addLabel="Create Operator"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading operators...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error loading operators: {error}</p>
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
        isOpen={!!deleteOperator}
        onClose={() => setDeleteOperator(null)}
        onConfirm={async () => {
          console.log('Delete:', deleteOperator);
          setDeleteOperator(null);
        }}
        title="Delete Operator"
        message={`Delete ${deleteOperator?.name}?`}
        variant="danger"
      />
    </div>
  );
}
