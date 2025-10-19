/**
 * Bookings Table Column Definitions
 * 
 * Separated for file size compliance (<200 lines)
 */

import type { Column } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin/shared/api/contracts/bookings';

export const bookingsColumns: Column<BookingListItem>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: (row: BookingListItem) => row.id.slice(0, 8),
    width: '100px',
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row: BookingListItem) => row.status.toUpperCase(),
    width: '120px',
  },
  {
    id: 'customer_name',
    header: 'Customer',
    accessor: (row: BookingListItem) => row.customer_name,
    width: '180px',
  },
  {
    id: 'pickup_location',
    header: 'Pickup',
    accessor: (row: BookingListItem) => row.pickup_location,
    width: '200px',
  },
  {
    id: 'destination',
    header: 'Destination',
    accessor: (row: BookingListItem) => row.destination,
    width: '200px',
  },
  {
    id: 'scheduled_at',
    header: 'Scheduled',
    accessor: (row: BookingListItem) => {
      if (!row.scheduled_at) return 'ASAP';
      return new Date(row.scheduled_at).toLocaleString('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    },
    width: '150px',
  },
  {
    id: 'fare_amount',
    header: 'Fare',
    accessor: (row: BookingListItem) => `£${(row.fare_amount / 100).toFixed(2)}`,
    width: '100px',
    align: 'right' as const,
  },
  {
    id: 'driver_name',
    header: 'Driver',
    accessor: (row: BookingListItem) => row.driver_name || 'Unassigned',
    width: '150px',
  },
];
