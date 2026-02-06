'use client';

/**
 * Bookings Table with TanStack Table
 * Premium table with all features: sorting, filtering, pagination, column resizing, row selection
 * Preserves ALL existing data and functionality from original BookingsTable
 */

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnResizeMode,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import type { BookingListItem } from '@vantage-lane/contracts';
import { ChevronDown, ChevronRight, ChevronUp, RefreshCw } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useBookingsListSwitcher } from '../hooks/useBookingsListSwitcher';
import { getBookingGroupClass } from '../utils/bookingGroupColors';
import { BookingExpandedRow } from './BookingExpandedRow';
import styles from './BookingsTableTanStack.module.css';
import { BulkActionsBar } from './BulkActionsBar';
import { TableActionBar } from './TableActionBar';

// Import column definitions
import { getActionsColumn } from '../columns/actions';
import { getCustomerColumn, getReferenceColumn } from '../columns/cells';
import { getPaymentColumn, getRouteColumn, getStatusColumn, getVehicleColumn } from '../columns/cells-details';

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  
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
      if (next.has(bookingId)) {
        next.delete(bookingId);
      } else {
        next.add(bookingId);
      }
      return next;
    });
  }, []);

  // Define columns using TanStack Table format
  const columns = React.useMemo<ColumnDef<BookingListItem>[]>(() => {
    // Get original column definitions
    const referenceCol = getReferenceColumn();
    const customerCol = getCustomerColumn();
    const routeCol = getRouteColumn();
    const vehicleCol = getVehicleColumn();
    const paymentCol = getPaymentColumn();
    const statusCol = getStatusColumn();
    const actionsCol = getActionsColumn();

    return [
      // Expand column
      {
        id: '__expand__',
        header: '',
        size: 40,
        enableResizing: false,
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(row.original.id);
            }}
            className={styles.expandBtn}
            aria-label={expandedIds.has(row.original.id) ? 'Collapse row' : 'Expand row'}
          >
            {expandedIds.has(row.original.id) ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ),
      },
      // Reference column
      {
        id: 'reference',
        header: 'Reference',
        accessorFn: (row) => row.reference,
        size: 100,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => referenceCol.cell?.(row.original, row.original.reference),
      },
      // Customer column
      {
        id: 'customer',
        header: 'Customer',
        accessorFn: (row) => row.customer_name,
        size: 120,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => customerCol.cell?.(row.original, row.original.customer_name),
      },
      // Route column
      {
        id: 'route',
        header: 'Route',
        accessorFn: (row) => `${row.pickup_location} → ${row.destination}`,
        size: 180,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => routeCol.cell?.(row.original, `${row.original.pickup_location} → ${row.original.destination}`),
      },
      // Vehicle column
      {
        id: 'vehicle',
        header: 'Vehicle',
        accessorFn: (row) => row.category,
        size: 100,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => vehicleCol.cell?.(row.original, row.original.category),
      },
      // Payment column
      {
        id: 'payment',
        header: 'Payment',
        accessorFn: (row) => row.fare_amount,
        size: 160,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => paymentCol.cell?.(row.original, row.original.fare_amount),
      },
      // Status column
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.status,
        size: 110,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => statusCol.cell?.(row.original, row.original.status),
      },
      // Actions column
      {
        id: 'actions',
        header: 'Actions',
        size: 80,
        enableResizing: false,
        enableSorting: false,
        cell: ({ row }) => actionsCol.cell?.(row.original, null),
      },
    ];
  }, [expandedIds, toggleExpand]);

  // Create table instance
  const table = useReactTable({
    data: bookings,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize)),
  });

  // Get selected count
  const selectedCount = Object.keys(rowSelection).length;

  // Page size options
  const pageSizeOptions = [10, 25, 50, -1];
  const totalPages =
    pagination.pageSize === -1
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

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={styles.th}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`${styles.headerContent} ${
                          header.column.getCanSort() ? styles.sortable : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className={styles.sortIcon}>
                            {{
                              asc: <ChevronUp size={14} />,
                              desc: <ChevronDown size={14} />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Column resizer */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`${styles.resizer} ${
                          header.column.getIsResizing() ? styles.isResizing : ''
                        }`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={styles.loadingCell}>
                  <RefreshCw className={styles.spinner} size={24} />
                  <span>Loading bookings...</span>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const booking = row.original;
                const isExpanded = expandedIds.has(booking.id);
                const groupClass = getBookingGroupClass(booking.id);
                
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`${styles.tr} ${booking.isNew ? styles.newBookingRow : ''} ${
                        groupClass ? styles[groupClass as keyof typeof styles] : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={styles.td}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={columns.length} className={styles.expandedCell}>
                          <BookingExpandedRow booking={booking} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalCount > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount} bookings
          </div>
          <div className={styles.paginationControls}>
            <button
              onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
              disabled={pagination.pageIndex === 0}
              className={styles.paginationBtn}
            >
              First
            </button>
            <button
              onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
              className={styles.paginationBtn}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
              disabled={pagination.pageIndex >= totalPages - 1}
              className={styles.paginationBtn}
            >
              Next
            </button>
            <button
              onClick={() => setPagination((p) => ({ ...p, pageIndex: totalPages - 1 }))}
              disabled={pagination.pageIndex >= totalPages - 1}
              className={styles.paginationBtn}
            >
              Last
            </button>
          </div>
          <div className={styles.pageSizeSelector}>
            <label htmlFor="pageSize">Rows per page:</label>
            <select
              id="pageSize"
              value={pagination.pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPagination((p) => ({ pageIndex: 0, pageSize: newSize, totalCount: p.totalCount }));
              }}
              className={styles.pageSizeSelect}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size === -1 ? 'All' : size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
