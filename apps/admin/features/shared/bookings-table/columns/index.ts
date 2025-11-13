/**
 * Bookings Columns - Barrel Export
 *
 * Main entry point for bookings table columns configuration.
 */

import type { BookingsColumnsProps, BookingColumn } from './schema';
import { getSelectColumn, getExpandColumn, getReferenceColumn, getCustomerColumn } from './cells';
import {
  getRouteColumn,
  getVehicleColumn,
  getPaymentColumn,
  getStatusColumn,
} from './cells-details';
import { getActionsColumn } from './actions';

export * from './schema';
export * from './helpers';
export * from './cells';
export * from './cells-details';
export * from './actions';
export * from './VehicleChip';

/**
 * Get all bookings table columns
 */
export const getBookingsColumns = (props: BookingsColumnsProps = {}): BookingColumn[] => [
  getSelectColumn(props),
  getExpandColumn(),
  getReferenceColumn(),
  getCustomerColumn(),
  getRouteColumn(),
  getVehicleColumn(),
  getPaymentColumn(),
  getStatusColumn(),
  getActionsColumn(),
];

// Backward compatibility export
export const bookingsColumns = getBookingsColumns();
