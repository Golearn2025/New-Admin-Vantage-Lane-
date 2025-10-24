/**
 * CustomersTable Component
 * 
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
} from '@vantage-lane/ui-core';
import { useCustomersTable } from '../hooks/useCustomersTable';
import { getCustomerColumns } from '../columns/customerColumns';
import styles from './CustomersTable.module.css';

export interface CustomersTableProps {
  className?: string;
}

export function CustomersTable({ className }: CustomersTableProps) {
  const { data, loading, error, refetch } = useCustomersTable();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteCustomer, setDeleteCustomer] = useState<any>(null);

  // Filter customers based on search query
  const filteredData = useMemo(() => {
    return data.filter((customer) => {
      const query = searchQuery.toLowerCase();
      const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query))
      );
    });
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const columns = getCustomerColumns({
    onView: (customer: any) => console.log('View:', customer),
    onEdit: (customer: any) => console.log('Edit:', customer),
    onDelete: (customer: any) => setDeleteCustomer(customer),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Customers</h1>
          <span className={styles.count}>
            {loading ? '...' : `${filteredData.length} customers`}
          </span>
        </div>

        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
          />

          <TableActions
            onAdd={() => console.log('Add customer')}
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
            addLabel="Create Customer"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading customers...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error loading customers: {error}</p>
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
        isOpen={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={async () => {
          console.log('Delete:', deleteCustomer);
          setDeleteCustomer(null);
        }}
        title="Delete Customer"
        message={`Delete ${deleteCustomer?.firstName} ${deleteCustomer?.lastName}?`}
        variant="danger"
      />
    </div>
  );
}
