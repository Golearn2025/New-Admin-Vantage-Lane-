/**
 * PaymentsColumns Component
 * 
 * Defines columns configuration for payments table
 * 
 * ✅ Zero any types
 * ✅ Centralized formatters
 * ✅ Reusable column definitions
 */

import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import type { PaymentTableRow } from '../types';
import styles from './PaymentsTable.module.css';

export const paymentsColumns = [
  { 
    id: 'id', 
    header: 'Payment ID', 
    accessor: (row: PaymentTableRow) => row.id,
    width: '150px',
    resizable: true,
    sortable: true,
    cell: (row: PaymentTableRow) => (
      <button
        className={styles.copyableId}
        onClick={() => {
          navigator.clipboard.writeText(row.id);
          alert('Payment ID copied!');
        }}
        title={`Click to copy: ${row.id}`}
      >
        {row.id}
      </button>
    )
  },
  { 
    id: 'bookingId', 
    header: 'Booking ID', 
    accessor: (row: PaymentTableRow) => row.bookingId,
    width: '150px',
    resizable: true,
    sortable: true,
    cell: (row: PaymentTableRow) => (
      <button
        className={styles.copyableId}
        onClick={() => {
          navigator.clipboard.writeText(row.bookingId);
          alert('Booking ID copied!');
        }}
        title={`Click to copy: ${row.bookingId}`}
      >
        {row.bookingId}
      </button>
    )
  },
  {
    id: 'amount',
    header: 'Amount',
    accessor: (row: PaymentTableRow) => row.amount,
    sortable: true,
    resizable: true,
    width: '120px',
    cell: (row: PaymentTableRow) => (
      <span className={styles.amount}>
        {formatCurrency(row.amount / 100)}
      </span>
    )
  },
  { 
    id: 'status', 
    header: 'Status', 
    accessor: (row: PaymentTableRow) => row.status,
    sortable: true,
    resizable: true,
    width: '120px',
    cell: (row: PaymentTableRow) => (
      <span className={styles.statusBadge}>
        {row.status}
      </span>
    )
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessor: (row: PaymentTableRow) => row.createdAt,
    sortable: true,
    resizable: true,
    width: '130px',
    cell: (row: PaymentTableRow) => (
      <span className={styles.date}>
        {formatDate(row.createdAt)}
      </span>
    )
  },
];
