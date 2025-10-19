/**
 * Bookings Columns - Part 2 (Vehicle → Status)
 * Compliant: <200 lines
 * Refactored: All inline styles moved to CSS module
 */

import React from 'react';
import type { Column } from '@vantage-lane/ui-core';
import { StatusBadge } from '@vantage-lane/ui-core';
import type { BookingStatus } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin/shared/api/contracts/bookings';
import { formatTripDetails, getVehicleDisplay } from './helpers';
import styles from './columns.module.css';

export const columnspart2: Column<BookingListItem>[] = [
  {
    id: 'vehicle',
    header: 'Vehicle',
    accessor: (row: BookingListItem) => row.category,
    width: '140px',
    cell: (row: BookingListItem) => (
      <div className={styles.detailsCell}>
        <div className={styles.referenceCell}>
          {row.category}
        </div>
        <div className={styles.customerPhone}>
          {getVehicleDisplay(row)}
        </div>
      </div>
    ),
  },
  {
    id: 'trip_details',
    header: 'Distance',
    accessor: (row: BookingListItem) => formatTripDetails(row),
    width: '120px',
    cell: (row: BookingListItem) => (
      <div className={styles.detailValue}>
        {formatTripDetails(row)}
      </div>
    ),
  },
  {
    id: 'fare_amount',
    header: 'Total',
    accessor: (row: BookingListItem) => row.fare_amount,
    width: '100px',
    align: 'right' as const,
    cell: (row: BookingListItem) => (
      <div className={styles.priceCell}>
        £{(row.fare_amount / 100).toFixed(2)}
      </div>
    ),
  },
  {
    id: 'driver',
    header: 'Driver',
    accessor: (row: BookingListItem) => row.driver_name || 'Unassigned',
    width: '140px',
    cell: (row: BookingListItem) => (
      <div className={styles.driverCell}>
        {row.driver_name ? (
          <span className={styles.driverName}>{row.driver_name}</span>
        ) : (
          <span className={styles.unassigned}>
            Unassigned
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row: BookingListItem) => row.status,
    width: '180px',
    cell: (row: BookingListItem) => (
      <StatusBadge
        status={row.status as BookingStatus}
        isUrgent={row.is_urgent}
        isNew={row.is_new}
        showIcon={true}
        size="md"
      />
    ),
  },
];
