/**
 * Bookings Columns - Basic Cell Renderers
 * (Select, Expand, Reference, Customer)
 */

'use client';

import React from 'react';
import { Email, Phone } from '@vantage-lane/ui-icons';
import { getTripIcon } from './helpers';
import styles from './columns.module.css';
import type { BookingColumn, BookingsColumnsProps } from './schema';

export const getSelectColumn = ({
  onSelectAll,
  onSelectRow,
  allSelected = false,
  selectedIds = new Set(),
}: BookingsColumnsProps): BookingColumn => ({
  id: 'select',
  header: (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={allSelected}
      onChange={(e) => onSelectAll?.(e.target.checked)}
      aria-label="Select all bookings"
    />
  ),
  width: '40px',
  cell: (row) => (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={selectedIds.has(row.id)}
      onChange={(e) => onSelectRow?.(row.id, e.target.checked)}
      aria-label={`Select booking ${row.reference}`}
    />
  ),
});

export const getExpandColumn = (): BookingColumn => ({
  id: 'expand',
  header: '',
  width: '40px',
  cell: () => <button className={styles.expandButton}>▶️</button>,
});

export const getReferenceColumn = (): BookingColumn => ({
  id: 'reference',
  header: 'Reference',
  accessor: (row) => row.reference,
  width: '120px',
  cell: (row) => (
    <div className={styles.referenceCell}>
      <div className={styles.referenceId}>{row.reference}</div>
      <div className={styles.referenceType}>
        {getTripIcon(row.trip_type)} {row.trip_type.toUpperCase()}
      </div>
    </div>
  ),
});

export const getCustomerColumn = (): BookingColumn => ({
  id: 'customer',
  header: 'Customer',
  accessor: (row) => row.customer_name,
  width: '150px',
  cell: (row) => (
    <div className={styles.customerCell}>
      <div className={styles.customerName}>{row.customer_name}</div>
      <a
        href={`tel:${row.customer_phone}`}
        className={styles.customerContact}
        onClick={(e) => e.stopPropagation()}
      >
        <Phone size={14} />
        <span>{row.customer_phone}</span>
      </a>
      {row.customer_email && (
        <a
          href={`mailto:${row.customer_email}`}
          className={styles.customerEmail}
          onClick={(e) => e.stopPropagation()}
        >
          <Email size={14} />
          <span>{row.customer_email}</span>
        </a>
      )}

      {/* Customer Stats */}
      <div className={styles.customerStats}>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Tier:</span>
          <span className={styles.statValue}>{row.customer_loyalty_tier || 'bronze'}</span>
        </div>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Status:</span>
          <span className={styles.statValue}>{row.customer_status || 'active'}</span>
        </div>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Spent:</span>
          <span className={styles.statValue}>£{(row.customer_total_spent / 100).toFixed(2)}</span>
        </div>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Rides:</span>
          <span className={styles.statValue}>
            {row.customer_total_bookings} {row.customer_total_bookings === 0 ? '(FIRST!)' : ''}
          </span>
        </div>
      </div>
    </div>
  ),
});
