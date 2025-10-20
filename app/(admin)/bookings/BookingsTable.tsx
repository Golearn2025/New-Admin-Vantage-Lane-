'use client';

/**
 * Bookings Table Component - REUSABLE
 *
 * Premium bookings table with filters, pagination, and StatusBadge
 * Compliant: <200 lines
 * Refactored: All inline styles moved to CSS module
 */

import React, { useState, useCallback } from 'react';
import { DataTable } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import { useBookingsList } from './hooks/useBookingsList';
import { BookingExpandedRow } from './components/BookingExpandedRow';
import { getBookingsColumns } from './columns';
import styles from './BookingsTable.module.css';

interface BookingsTableProps {
  statusFilter?: string[];
  title: string;
  description?: string;
  showStatusFilter?: boolean;
}

export function BookingsTable({
  statusFilter = [],
  title,
  description,
  showStatusFilter = false,
}: BookingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState(false);

  const { bookings, loading, error, totalCount, fetchBookings } = useBookingsList({
    statusFilter,
    selectedStatus: showStatusFilter ? selectedStatus : 'all',
    currentPage,
    pageSize,
  });

  // Toggle expand for a booking
  const toggleExpand = (bookingId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
  };

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = new Set(bookings.map((b) => b.id));
        setSelectedIds(allIds);
        setAllSelected(true);
      } else {
        setSelectedIds(new Set());
        setAllSelected(false);
      }
    },
    [bookings]
  );

  // Handle select individual row
  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
        setAllSelected(false);
      }
      return next;
    });
  }, []);

  // Create columns with expand toggle and select
  const columnsWithExpand = React.useMemo(() => {
    const baseColumns = getBookingsColumns({
      onSelectAll: handleSelectAll,
      onSelectRow: handleSelectRow,
      allSelected,
      selectedIds,
    });

    return baseColumns.map((col) => {
      if (col.id === 'expand') {
        return {
          ...col,
          cell: (row: BookingListItem) => (
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(row.id);
              }}
              aria-label={expandedIds.has(row.id) ? 'Collapse row' : 'Expand row'}
            >
              {expandedIds.has(row.id) ? '▼' : '▶️'}
            </button>
          ),
        };
      }
      return col;
    });
  }, [expandedIds, allSelected, selectedIds, handleSelectAll, handleSelectRow]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description && (
          <p className={styles.description}>
            {description} ({totalCount} total)
          </p>
        )}
      </div>

      {/* Filters & Actions */}
      <div className={styles.filtersContainer}>
        {showStatusFilter && (
          <div className={styles.filterGroup}>
            <label htmlFor="status-filter" className={styles.filterLabel}>
              Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.select}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="en_route">En Route</option>
              <option value="arrived">Arrived</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div className={styles.actionsContainer}>
          <button onClick={fetchBookings} disabled={loading} className={styles.refreshButton}>
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorState}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* DataTable */}
      <DataTable<BookingListItem>
        data={bookings}
        columns={columnsWithExpand}
        loading={loading}
        emptyState="No bookings found."
        expandable={true}
        expandedIds={expandedIds}
        renderExpandedRow={(booking) => <BookingExpandedRow booking={booking} />}
        striped={true}
        bordered={true}
        stickyHeader={true}
        pagination={{
          pageIndex: currentPage - 1,
          pageSize: pageSize,
          totalCount: totalCount,
        }}
        onPaginationChange={(newPagination) => {
          setCurrentPage(newPagination.pageIndex + 1);
          setPageSize(newPagination.pageSize);
        }}
      />
    </div>
  );
}
