/**
 * useBookingsColumns — TanStack ColumnDef[] for bookings table
 *
 * Bridges existing BookingColumn definitions (ui-core Column format)
 * to TanStack ColumnDef format. Keeps columns memo independent of expandedIds
 * for scroll performance.
 *
 * <120 lines — RULES.md compliant
 */

'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { BookingListItem } from '@vantage-lane/contracts';
import { useMemo } from 'react';

import { getActionsColumn } from '../columns/actions';
import { getCustomerColumn, getReferenceColumn } from '../columns/cells';
import { getAssignmentColumn, getServicesColumn } from '../columns/cells-assignment';
import {
    getPaymentColumn,
    getRouteColumn,
    getStatusColumn,
    getVehicleColumn,
} from '../columns/cells-details';

export function useBookingsColumns(): ColumnDef<BookingListItem, unknown>[] {
  const referenceCol = useMemo(() => getReferenceColumn(), []);
  const customerCol = useMemo(() => getCustomerColumn(), []);
  const routeCol = useMemo(() => getRouteColumn(), []);
  const vehicleCol = useMemo(() => getVehicleColumn(), []);
  const servicesCol = useMemo(() => getServicesColumn(), []);
  const paymentCol = useMemo(() => getPaymentColumn(), []);
  const assignmentCol = useMemo(() => getAssignmentColumn(), []);
  const statusCol = useMemo(() => getStatusColumn(), []);
  const actionsCol = useMemo(() => getActionsColumn(), []);

  return useMemo<ColumnDef<BookingListItem, unknown>[]>(
    () => [
      {
        id: 'reference',
        header: 'Reference',
        accessorFn: (row) => row.reference,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => referenceCol.cell?.(row.original, row.original.reference),
      },
      {
        id: 'customer',
        header: 'Customer',
        accessorFn: (row) => row.customer_name,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => customerCol.cell?.(row.original, row.original.customer_name),
      },
      {
        id: 'route',
        header: 'Route',
        accessorFn: (row) => `${row.pickup_location} → ${row.destination}`,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) =>
          routeCol.cell?.(row.original, `${row.original.pickup_location} → ${row.original.destination}`),
      },
      {
        id: 'vehicle',
        header: 'Vehicle',
        accessorFn: (row) => row.category,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => vehicleCol.cell?.(row.original, row.original.category),
      },
      {
        id: 'services',
        header: 'Services',
        accessorFn: (row) => (row.paid_services || []).length,
        enableResizing: true,
        enableSorting: false,
        cell: ({ row }) => servicesCol.cell?.(row.original, null),
      },
      {
        id: 'payment',
        header: 'Payment',
        accessorFn: (row) => row.fare_amount,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => paymentCol.cell?.(row.original, row.original.fare_amount),
      },
      {
        id: 'assignment',
        header: 'Assignment',
        accessorFn: (row) => row.driver_name,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => assignmentCol.cell?.(row.original, row.original.driver_name),
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => row.status,
        enableResizing: true,
        enableSorting: true,
        cell: ({ row }) => statusCol.cell?.(row.original, row.original.status),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableResizing: false,
        enableSorting: false,
        cell: ({ row }) => actionsCol.cell?.(row.original, null),
      },
    ],
    [referenceCol, customerCol, routeCol, vehicleCol, servicesCol, paymentCol, assignmentCol, statusCol, actionsCol]
  );
}
