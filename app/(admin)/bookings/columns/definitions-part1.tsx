/**
 * Bookings Columns - Part 1 (Reference → Dates)
 * Compliant: <200 lines
 * Refactored: All inline styles moved to CSS module
 */

import React from 'react';
import type { Column } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin/shared/api/contracts/bookings';
import { formatDateTime, getTripTypeIcon } from './helpers';
import styles from './columns.module.css';

export const columnspart1: Column<BookingListItem>[] = [
  {
    id: 'reference',
    header: 'Reference',
    accessor: (row: BookingListItem) => row.reference,
    width: '110px',
    cell: (row: BookingListItem) => (
      <div className={styles.referenceCell}>
        {row.reference}
      </div>
    ),
  },
  {
    id: 'trip_type',
    header: 'Type',
    accessor: (row: BookingListItem) => row.trip_type,
    width: '80px',
    cell: (row: BookingListItem) => (
      <div className={styles.tripTypeCell}>
        <span className={styles.tripTypeIcon}>{getTripTypeIcon(row.trip_type)}</span>
        <span className={styles.tripTypeText}>
          {row.trip_type}
        </span>
      </div>
    ),
  },
  {
    id: 'customer',
    header: 'Customer',
    accessor: (row: BookingListItem) => row.customer_name,
    width: '180px',
    cell: (row: BookingListItem) => (
      <div className={styles.customerCell}>
        <div className={styles.customerName}>{row.customer_name}</div>
        <div className={styles.customerPhone}>
          {row.customer_phone}
        </div>
        {row.customer_total_bookings > 0 && (
          <div className={styles.customerStats}>
            {row.customer_total_bookings} booking{row.customer_total_bookings !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'route',
    header: 'Route',
    accessor: (row: BookingListItem) => `${row.pickup_location} → ${row.destination}`,
    width: '240px',
    cell: (row: BookingListItem) => (
      <div className={styles.routeCell}>
        <div className={styles.routeItem}>
          <span className={styles.pickupDot}>●</span>
          <span className={styles.routeLocation}>{row.pickup_location}</span>
        </div>
        <div className={styles.routeItem}>
          <span className={styles.dropoffDot}>●</span>
          <span>{row.destination}</span>
        </div>
      </div>
    ),
  },
  {
    id: 'dates',
    header: 'Dates',
    accessor: (row: BookingListItem) => row.scheduled_at,
    width: '160px',
    cell: (row: BookingListItem) => (
      <div className={styles.datesCell}>
        <div className={styles.dateLabel}>
          🚗 {formatDateTime(row.scheduled_at, 'date')}
        </div>
        <div className={styles.dateValue}>
          {formatDateTime(row.scheduled_at, 'time')}
        </div>
        <div className={styles.dateLabel}>
          📝 Made: {formatDateTime(row.created_at, 'date')}
        </div>
        <div className={styles.dateValue}>
          {formatDateTime(row.created_at, 'time')}
        </div>
      </div>
    ),
  },
];
