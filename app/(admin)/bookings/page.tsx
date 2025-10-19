'use client';

/**
 * Bookings List Page
 * 
 * Displays all bookings in a DataTable with filters
 * M1.0 - First production feature using DataTable component
 */

import React, { useState, useEffect } from 'react';
import { DataTable } from '@vantage-lane/ui-core';
import type { BookingListItem, BookingsListResponse } from '@admin/shared/api/contracts/bookings';
import { bookingsColumns } from './columns';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch bookings from API
  const fetchBookings = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/bookings/list?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BookingsListResponse = await response.json();
      
      setBookings(data.data);
      setTotalCount(data.pagination.total_count);
      
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Columns imported from separate file for file size compliance

  // Handle row click
  const handleRowClick = (row: BookingListItem) => {
    // Navigate to booking detail page
    window.location.href = `/bookings/${row.id}`;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Bookings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage and view all bookings ({totalCount} total)
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div>
          <label
            htmlFor="status-filter"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={fetchBookings}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-danger-alpha-10)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            color: 'var(--color-danger)',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* DataTable */}
      <DataTable<BookingListItem>
        data={bookings}
        columns={bookingsColumns}
        loading={loading}
        emptyState="No bookings found. Try adjusting your filters."
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
