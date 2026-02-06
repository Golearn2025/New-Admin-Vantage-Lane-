'use client';

/**
 * Bookings Table — Uses TanStackDataTable from ui-core
 *
 * Orchestrator: bookings-specific logic (columns, data hook, expand, pagination).
 * Table rendering delegated to generic TanStackDataTable.
 * <200 lines — RULES.md compliant
 */

import type { BookingListItem } from '@vantage-lane/contracts';
import { Pagination, TanStackDataTable } from '@vantage-lane/ui-core';
import React, { useCallback, useState } from 'react';
import { useBookingsColumns } from '../hooks/useBookingsColumns';
import { useBookingsListSwitcher } from '../hooks/useBookingsListSwitcher';
import { getBookingGroupClass } from '../utils/bookingGroupColors';
import { BookingExpandedRow } from './BookingExpandedRow';
import styles from './BookingsTableTanStack.module.css';
import { BulkActionsBar } from './BulkActionsBar';
import { TableActionBar } from './TableActionBar';

interface BookingsTableTanStackProps {
  statusFilter?: string[];
  tripTypeFilter?: string | null;
  title: string;
  description?: string;
  showStatusFilter?: boolean;
  statusFilterOptions?: string[];
}

export function BookingsTableTanStack({
  statusFilter = [],
  tripTypeFilter = null,
  title,
  description,
  showStatusFilter = false,
  statusFilterOptions,
}: BookingsTableTanStackProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
    totalCount: 0,
  });

  // Fetch bookings data
  const { bookings, loading, error, totalCount, fetchBookings } = useBookingsListSwitcher({
    statusFilter,
    selectedStatus: showStatusFilter ? selectedStatus : 'all',
    tripTypeFilter,
    currentPage: pagination.pageIndex + 1,
    pageSize: pagination.pageSize === -1 ? 999999 : pagination.pageSize,
  });

  // Update totalCount when data arrives
  React.useEffect(() => {
    setPagination((p) => ({ ...p, totalCount: totalCount }));
  }, [totalCount]);

  // Toggle expand for a booking
  const toggleExpand = useCallback((bookingId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) next.delete(bookingId);
      else next.add(bookingId);
      return next;
    });
  }, []);

  // Columns — extracted to separate hook for modularity
  const columns = useBookingsColumns();

  // Expand button renderer — shown inside the combined first column (checkbox + # + expand)
  const renderExpandButton = useCallback((booking: BookingListItem) => {
    const isOpen = expandedIds.has(booking.id);
    return (
      <button
        onClick={(e) => { e.stopPropagation(); toggleExpand(booking.id); }}
        className={styles.expandBtn + (isOpen ? ` ${styles.expandBtnActive}` : '')}
        aria-label={isOpen ? 'Collapse' : 'Expand'}
      >
        <span className={styles.triangle}>{isOpen ? '▼' : '▶'}</span> Details
      </button>
    );
  }, [expandedIds, toggleExpand]);

  // Row className — memoized callback (no dependency on expandedIds)
  const getRowClassName = useCallback((row: BookingListItem) => {
    const classes: string[] = [];
    if (row.isNew && styles.newBookingRow) classes.push(styles.newBookingRow);
    const groupClass = row.id ? getBookingGroupClass(row.id) : null;
    if (groupClass) classes.push(styles[groupClass as keyof typeof styles] || '');
    return classes.filter(Boolean).join(' ');
  }, []);

  // Selected count
  const selectedCount = Object.keys(rowSelection).length;

  // Pagination
  const totalPages = pagination.pageSize === -1
    ? 1
    : Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize));

  return (
    <div className={styles.container}>
      <BulkActionsBar
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
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
        {...(statusFilterOptions && { statusFilterOptions })}
      />

      {/* Error state */}
      {error && <div className={styles.errorState}>{error}</div>}

      {/* Table — generic TanStackDataTable from ui-core */}
      <TanStackDataTable<BookingListItem>
        data={bookings}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        emptyState="No bookings found."
        striped={false}
        enableSelection={true}
        enableResize={true}
        stickyHeader={true}
        maxHeight="75vh"
        ariaLabel="Bookings table"
        expandedIds={expandedIds}
        renderExpandedRow={(booking) => <BookingExpandedRow booking={booking} />}
        getRowClassName={getRowClassName}
        manualPagination={true}
        totalCount={pagination.totalCount}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        showRowNumbers={true}
        rowNumberOffset={pagination.pageIndex * pagination.pageSize}
        renderExpandButton={renderExpandButton}
      />

      {/* Pagination — ui-core Pagination component */}
      {pagination.totalCount > 0 && (
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize === -1 ? pagination.totalCount : pagination.pageSize}
          pageSizeOptions={[10, 25, 50, -1]}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
          onPageSizeChange={(newSize) => {
            setPagination((p) => ({ pageIndex: 0, pageSize: newSize, totalCount: p.totalCount }));
          }}
          showInfo={true}
          showPageSizeSelector={true}
          showPrevNext={true}
          showFirstLast={true}
          size="medium"
        />
      )}
    </div>
  );
}
