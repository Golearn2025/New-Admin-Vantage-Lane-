'use client';

/**
 * Bookings Table Component - REUSABLE
 *
 * Premium bookings table with filters, pagination, and StatusBadge
 * Compliant: <200 lines
 * Refactored: All inline styles moved to CSS module
 */

import type { BookingListItem } from '@vantage-lane/contracts';
import {
  EnterpriseDataTable,
  Pagination,
  useColumnResize,
  useSelection,
  useSorting,
} from '@vantage-lane/ui-core';
import React, { useCallback, useState } from 'react';
import { getBookingsColumns } from '../columns';
import { useBookingsList } from '../hooks/useBookingsList';
import { getBookingGroupClass } from '../utils/bookingGroupColors';
import { BookingExpandedRow } from './BookingExpandedRow';
import styles from './BookingsTable.module.css';
import { BulkActionsBar } from './BulkActionsBar';
import { TableActionBar } from './TableActionBar';

interface BookingsTableProps {
  statusFilter?: string[];
  tripTypeFilter?: string | null;
  title: string;
  description?: string;
  showStatusFilter?: boolean;
}

export function BookingsTable({
  statusFilter = [],
  tripTypeFilter = null,
  title,
  description,
  showStatusFilter = false,
}: BookingsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10, // ✅ Default 10 rows
    totalCount: 0,
  });

  // Fetch bookings data with "All" support
  const { bookings, loading, error, totalCount, fetchBookings } = useBookingsList({
    statusFilter,
    selectedStatus: showStatusFilter ? selectedStatus : 'all',
    tripTypeFilter,
    currentPage: pagination.pageIndex + 1,
    pageSize: pagination.pageSize === -1 ? 999999 : pagination.pageSize, // -1 = All
  });

  // Update totalCount when data arrives
  React.useEffect(() => {
    setPagination((p) => ({ ...p, totalCount: totalCount }));
  }, [totalCount]);

  // Use EnterpriseDataTable hooks
  const selection = useSelection<BookingListItem>({
    data: bookings,
    getRowId: (row) => row.id,
  });
  const sorting = useSorting({ initialColumnId: null, initialDirection: null });
  const resize = useColumnResize();

  // Toggle expand for a booking - memoized
  const toggleExpand = useCallback((bookingId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
  }, []);

  // Page size options with "All"
  const pageSizeOptions = React.useMemo(() => [10, 25, 50, -1], []); // -1 = All rows

  // Calculate total pages
  const totalPages =
    pagination.pageSize === -1
      ? 1
      : Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize));

  // Get columns with expand button column
  const columns = React.useMemo(() => {
    const allColumns = getBookingsColumns();
    // Filter out select and old expand columns
    const filteredColumns = allColumns.filter((col) => col.id !== 'select' && col.id !== 'expand');

    // Add expand column with chevron button at start
    const expandColumn = {
      id: '__expand__',
      header: '',
      accessor: () => '',
      width: '40px',
      resizable: false,
      sortable: false,
      align: 'center' as const,
      cell: (row: BookingListItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(row.id);
          }}
          className={styles.expandBtn}
          aria-label={expandedIds.has(row.id) ? 'Collapse row' : 'Expand row'}
        >
          {expandedIds.has(row.id) ? '▼' : '▶'}
        </button>
      ),
    };

    return [expandColumn, ...filteredColumns];
  }, [expandedIds, toggleExpand]);

  // Get selected count for bulk actions
  const selectedCount = selection.selectedIds.size;
  const hasSelection = selectedCount > 0;

  return (
    <div className={styles.container}>
      <BulkActionsBar
        selectedCount={selectedCount}
        onClearSelection={() => selection.clearSelection()}
      />

      <TableActionBar
        loading={loading}
        showStatusFilter={showStatusFilter}
        selectedStatus={selectedStatus}
        onRefresh={() => fetchBookings()}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setPagination((p) => ({ ...p, pageIndex: 0 }));
        }}
      />

      {/* Error state */}
      {error && <div className={styles.errorState}>{error}</div>}

      {/* Table */}
      <div className={styles.tableContainer}>
        <EnterpriseDataTable<BookingListItem>
          data={bookings}
          columns={columns}
          selection={selection}
          sorting={sorting}
          resize={resize}
          loading={loading}
          emptyState="No bookings found."
          striped={true}
          bordered={true}
          stickyHeader={true}
          ariaLabel="Bookings table"
          expandedIds={expandedIds}
          renderExpandedRow={(booking) => <BookingExpandedRow booking={booking} />}
          getRowId={(row) => row.id}
          getRowClassName={(row: BookingListItem) => {
            const classes = [];
            if (row.isNew) classes.push(styles.newBookingRow);
            const groupClass = getBookingGroupClass(row.id);
            if (groupClass) classes.push(styles[groupClass as keyof typeof styles]);
            return classes.filter(Boolean).join(' ');
          }}
        />
      </div>

      {/* Pagination */}
      {pagination.totalCount > 0 && (
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize === -1 ? pagination.totalCount : pagination.pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
          onPageSizeChange={(newSize) => {
            if (newSize === -1) {
              // "All" selected - show all rows
              setPagination((p) => ({ pageIndex: 0, pageSize: -1, totalCount: p.totalCount }));
            } else {
              // Normal page size
              setPagination((p) => ({ pageIndex: 0, pageSize: newSize, totalCount: p.totalCount }));
            }
          }}
          showInfo={true}
          showPageSizeSelector={true}
          showPrevNext={true}
          showFirstLast={false}
          size="medium"
        />
      )}
    </div>
  );
}
