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

import React, { useEffect, useMemo } from 'react';
import { 
  EnterpriseDataTable,
  usePagination,
  useSorting,
  useSelection,
  useColumnResize,
  Pagination,
  TableFilters,
} from '@vantage-lane/ui-core';
import type { Payment } from '../types';
import { usePaymentsList } from '../hooks/usePaymentsList';
import { usePaymentsFilters } from '../hooks/usePaymentsFilters';
import { PaymentsActions } from './PaymentsActions';
import { PaymentsExport } from './PaymentsExport';
import { PaymentsMetrics } from './PaymentsMetrics';
import { paymentsColumns } from './PaymentsColumns';
import { filterPayments } from '../utils/paymentsFiltering';
import styles from './PaymentsTable.module.css';

export function PaymentsTable() {
  const { data, loading, error } = usePaymentsList();

  // Hooks modulare - Enterprise pattern!
  const pagination = usePagination({ initialPageSize: 25 });
  const sorting = useSorting({ initialColumnId: 'createdAt', initialDirection: 'desc' });
  const selection = useSelection({ 
    data, 
    getRowId: (row, index) => row.id || String(index) 
  });
  const resize = useColumnResize({
    initialWidths: {
      id: 150,
      bookingId: 150,
      amount: 120,
      status: 120,
      createdAt: 130,
    }
  });
  const filtersHook = usePaymentsFilters();

  // Update total count când se încarcă data
  useEffect(() => {
    if (data.length > 0) {
      pagination.setTotalCount(data.length);
    }
  }, [data, pagination]);

  // Filter data using utility function
  const filteredData = useMemo(() => {
    return filterPayments(data, filtersHook.filters);
  }, [data, filtersHook.filters]);

  // Update total count for filtered data
  useEffect(() => {
    pagination.setTotalCount(filteredData.length);
  }, [filteredData, pagination]);

  // Paginate filtered data - slice based on current page
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

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
        <EnterpriseDataTable
          data={paginatedData}
          selection={selection}
          sorting={sorting}
          resize={resize}
          columns={paymentsColumns}
          loading={loading}
          emptyState="No payment transactions found"
          striped={true}
          bordered={true}
          stickyHeader={true}
          ariaLabel="Payments table"
        />
      </div>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={pagination.pageCount}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => pagination.setPage(page - 1)}
          onPageSizeChange={pagination.setPageSize}
          showInfo={true}
          showPageSizeSelector={true}
        />
      </div>
    </div>
  );
}
