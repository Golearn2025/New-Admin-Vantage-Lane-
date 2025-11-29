/**
 * Refunds Table Columns
 * Column definitions cu formatare premium
 * < 150 lines - RULES.md compliant
 */

import React from 'react';
import type { RefundListItem } from '@entities/refund';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import styles from './columns.module.css';

// Column type definition
interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => any;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
  cell?: (row: T) => React.ReactNode;
}

// NOTE: formatCurrency and formatDate imported from centralized formatters

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case 'succeeded': return styles.statusSuccess;
      case 'pending': return styles.statusWarning;
      case 'failed': return styles.statusError;
      case 'cancelled': return styles.statusNeutral;
      default: return styles.statusNeutral;
    }
  };

  return (
    <span className={`${styles.statusBadge} ${getVariant()}`}>
      {status}
    </span>
  );
}

/**
 * Reason badge component
 */
function ReasonBadge({ reason }: { reason: string }) {
  const formatted = reason.replace(/_/g, ' ');
  return (
    <span className={styles.reasonBadge}>
      {formatted}
    </span>
  );
}

/**
 * Get refunds table columns
 */
export function getRefundsColumns(): Column<RefundListItem>[] {
  return [
    {
      id: 'bookingReference',
      header: 'Booking',
      accessor: (row) => row.bookingReference,
      sortable: true,
      resizable: true,
      width: '140px',
      cell: (row) => (
        <span className={styles.bookingRef}>
          {row.bookingReference}
        </span>
      )
    },
    {
      id: 'customerName',
      header: 'Customer',
      accessor: (row) => row.customerName,
      sortable: true,
      resizable: true,
      width: '180px'
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row) => row.amount,
      sortable: true,
      resizable: true,
      width: '120px',
      cell: (row) => (
        <span className={styles.amount}>
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      id: 'reason',
      header: 'Reason',
      accessor: (row) => row.reason,
      resizable: true,
      width: '160px',
      cell: (row) => <ReasonBadge reason={row.reason} />
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      resizable: true,
      width: '120px',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row) => row.createdAt,
      sortable: true,
      resizable: true,
      width: '130px',
      cell: (row) => (
        <span className={styles.date}>
          {formatDate(row.createdAt)}
        </span>
      )
    }
  ];
}
