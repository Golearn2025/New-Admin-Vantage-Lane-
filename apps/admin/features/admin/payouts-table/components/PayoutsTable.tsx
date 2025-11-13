/**
 * PayoutsTable Component
 * Enterprise table cu selection, resizing, export - 100% consistent
 * < 200 lines - RULES.md compliant
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { Download, CheckCircle, RefreshCw } from 'lucide-react';
import { 
  EnterpriseDataTable,
  usePagination,
  useSorting,
  useSelection,
  useColumnResize,
  BulkActionsToolbar,
  Pagination,
  MiniMetricCard,
  TableFilters,
  ActionButton,
} from '@vantage-lane/ui-core';
import { usePayoutsList } from '../hooks/usePayoutsList';
import { usePayoutsFilters } from '../hooks/usePayoutsFilters';
import { getPayoutsColumns } from '../columns';
import { calculatePayoutMetrics, handleExportSelected as exportSelected, getBulkActions, filterPayouts } from '../utils/tableHelpers';
import { PAYOUT_STATUS_OPTIONS } from '../constants';
import { PayoutsMetrics } from './PayoutsMetrics';
import styles from './PayoutsTable.module.css';

export function PayoutsTable() {
  const { data, loading, error } = usePayoutsList();

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
      driverId: 150,
      amount: 120,
      status: 120,
      createdAt: 130,
    }
  });
  const filtersHook = usePayoutsFilters();
  const columns = useMemo(() => getPayoutsColumns(), []);

  // Update total count când se încarcă data
  useEffect(() => {
    if (data.length > 0) {
      pagination.setTotalCount(data.length);
    }
  }, [data, pagination]);

  // Calculate metrics
  const metrics = useMemo(() => calculatePayoutMetrics(data), [data]);

  // Filter data
  const filteredData = useMemo(() => 
    filterPayouts(data, filtersHook.filters), 
    [data, filtersHook.filters]
  );

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

  // Bulk actions
  const bulkActions = getBulkActions((fmt) => exportSelected(fmt, selection.selectedCount));

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading payouts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PayoutsMetrics {...metrics} />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payouts</h1>
          <p className={styles.description}>
            Manage driver payouts and transfers
            {selection.selectedCount > 0 && (
              <span className={styles.selectedInfo}>
                {' '}• {selection.selectedCount} selected
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        statusOptions={PAYOUT_STATUS_OPTIONS}
        statusValue={filtersHook.filters.status}
        onStatusChange={filtersHook.setStatus}
        showDateRange={true}
        dateRange={filtersHook.filters.dateRange}
        onDateRangeChange={filtersHook.setDateRange}
        showSearch={true}
        searchValue={filtersHook.filters.search}
        searchPlaceholder="Search by Driver, Payout ID..."
        onSearchChange={filtersHook.setSearch}
        onClearAll={filtersHook.clearAll}
      />

      {/* Actions */}
      <div className={styles.actionButtons}>
        <ActionButton
          variant="primary"
          size="md"
          icon={<Download size={16} strokeWidth={2} />}
          label="Export for Wise"
          disabled={selection.selectedCount === 0}
          onClick={() => alert('Wise CSV export - TODO')}
        />
        <ActionButton
          variant="secondary"
          size="md"
          icon={<CheckCircle size={16} strokeWidth={2} />}
          label="Mark as Paid"
          disabled={selection.selectedCount === 0}
          onClick={() => alert(`Mark ${selection.selectedCount} as paid`)}
        />
        <ActionButton
          variant="secondary"
          size="md"
          icon={<RefreshCw size={16} strokeWidth={2} />}
          label="Sync Payouts"
          onClick={() => alert('Syncing...')}
        />
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selection.selectedCount}
        actions={bulkActions}
        onClearSelection={selection.clearSelection}
      />

      {/* Table area - scrollable */}
      <div className={styles.tableArea}>
        <EnterpriseDataTable
        data={paginatedData}
        columns={columns}
        selection={selection}
        sorting={sorting}
        resize={resize}
        loading={loading}
        emptyState="No payouts found"
        striped={true}
        bordered={true}
        stickyHeader={true}
        ariaLabel="Payouts table"
        />
      </div>

      {/* Pagination Controls */}
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
