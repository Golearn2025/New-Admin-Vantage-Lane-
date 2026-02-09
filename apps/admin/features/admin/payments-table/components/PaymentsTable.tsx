'use client';

/**
 * Payments Table Component - Main orchestrator
 * Refactored to <200 lines using modular components
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ UI-core components
 * ✅ Architecture: features → entities
 */

import {
    Pagination,
    TableFilters,
    TanStackDataTable,
    toTanStackColumns,
    useSelection,
} from '@vantage-lane/ui-core';
import { useEffect, useMemo, useState } from 'react';
import { usePaymentsFilters } from '../hooks/usePaymentsFilters';
import { usePaymentsList } from '../hooks/usePaymentsList';
import { filterPayments } from '../utils/paymentsFiltering';
import { PaymentsActions } from './PaymentsActions';
import { paymentsColumns } from './PaymentsColumns';
import { PaymentsExport } from './PaymentsExport';
import { PaymentsMetrics } from './PaymentsMetrics';
import styles from './PaymentsTable.module.css';

export function PaymentsTable() {
  const { data, loading, error } = usePaymentsList();
  const filtersHook = usePaymentsFilters();

  // Selection — keep useSelection for PaymentsActions/Export compatibility
  const selection = useSelection({ 
    data, 
    getRowId: (row, index) => row.id || String(index) 
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
    totalCount: 0,
  });

  // Filter data
  const filteredData = useMemo(() => {
    return filterPayments(data, filtersHook.filters);
  }, [data, filtersHook.filters]);

  // Update total count for filtered data
  useEffect(() => {
    setPagination((p) => {
      if (p.totalCount === filteredData.length) return p;
      return { ...p, totalCount: filteredData.length };
    });
  }, [filteredData]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  // Convert existing columns to TanStack format (bridge)
  const tanStackColumns = useMemo(() => toTanStackColumns(paymentsColumns), []);

  const totalPages = Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize));

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading payments: {error.message}
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.container}>
      {/* Metrics Cards */}
      <PaymentsMetrics data={data} />

      {/* Header with Export */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payment Transactions</h1>
          <p className={styles.description}>
            All payment transactions from bookings
            {selection.selectedCount > 0 && (
              <span className={styles.selectedInfo}>
                {' '}• {selection.selectedCount} selected
              </span>
            )}
          </p>
        </div>
        
        <PaymentsExport data={data} selection={selection} />
      </div>

      {/* Filters */}
      <TableFilters
        statusOptions={[
          { label: 'Succeeded', value: 'succeeded' },
          { label: 'Pending', value: 'pending' },
          { label: 'Failed', value: 'failed' },
          { label: 'Captured', value: 'captured' },
          { label: 'Authorized', value: 'authorized' },
        ]}
        statusValue={filtersHook.filters.status}
        onStatusChange={filtersHook.setStatus}
        showDateRange={true}
        dateRange={filtersHook.filters.dateRange}
        onDateRangeChange={filtersHook.setDateRange}
        showAmountRange={true}
        amountRange={filtersHook.filters.amountRange}
        onAmountRangeChange={filtersHook.setAmountRange}
        showSearch={true}
        searchValue={filtersHook.filters.search}
        searchPlaceholder="Search by ID, Booking ID, Status..."
        onSearchChange={filtersHook.setSearch}
        onClearAll={filtersHook.clearAll}
      />

      {/* Actions */}
      <PaymentsActions selection={selection} />

      {/* Table */}
      <div className={styles.tableArea}>
        <TanStackDataTable
          data={paginatedData}
          columns={tanStackColumns}
          getRowId={(row) => row.id || ''}
          loading={loading}
          emptyState="No payment transactions found"
          striped={true}
          enableResize={true}
          stickyHeader={true}
          ariaLabel="Payments table"
        />
      </div>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
          onPageSizeChange={(size) => setPagination((p) => ({ pageIndex: 0, pageSize: size, totalCount: p.totalCount }))}
          showInfo={true}
          showPageSizeSelector={true}
        />
      </div>
    </div>
  );
}
