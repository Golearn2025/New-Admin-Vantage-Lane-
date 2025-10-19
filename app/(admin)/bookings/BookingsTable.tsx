'use client';

/**
 * Bookings Table Component - REUSABLE
 * 
 * Premium bookings table with filters, pagination, and StatusBadge
 * Compliant: <200 lines
 * Refactored: All inline styles moved to CSS module
 */

import React, { useState } from 'react';
import { DataTable } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin/shared/api/contracts/bookings';
import { bookingsColumns } from './columns';
import { useBookingsList } from './hooks/useBookingsList';
import { BookingExpandedRow } from './components/BookingExpandedRow';
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

  const { bookings, loading, error, totalCount, fetchBookings } = useBookingsList({
    statusFilter,
    selectedStatus: showStatusFilter ? selectedStatus : 'all',
    currentPage,
    pageSize,
  });

  // Don't navigate on row click when expandable
  const handleRowClick = (row: BookingListItem) => {
    // Click expands/collapses - navigation handled by "View Full Details" button
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {title}
        </h1>
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
            <label
              htmlFor="status-filter"
              className={styles.filterLabel}
            >
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
          <button
            onClick={fetchBookings}
            disabled={loading}
            className={styles.refreshButton}
          >
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
        columns={bookingsColumns}
        loading={loading}
        emptyState="No bookings found."
        expandable={true}
        renderExpandedRow={(booking) => <BookingExpandedRow booking={booking} />}
        onRowClick={handleRowClick}
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
