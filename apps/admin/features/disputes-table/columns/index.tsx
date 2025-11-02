/**
 * Disputes Table Columns
 * Column definitions cu alerts pentru deadline
 * < 150 lines - RULES.md compliant
 */

import React from 'react';
import type { DisputeListItem } from '@entities/dispute';
import styles from './columns.module.css';

interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => any;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
  cell?: (row: T) => React.ReactNode;
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Check if deadline is approaching (< 3 days)
 */
function isDeadlineUrgent(evidenceDueBy: string | null): boolean {
  if (!evidenceDueBy) return false;
  const dueDate = new Date(evidenceDueBy);
  const now = new Date();
  const daysLeft = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysLeft < 3 && daysLeft > 0;
}

function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    if (status.includes('warning')) return styles.statusWarning;
    if (status === 'needs_response') return styles.statusError;
    if (status === 'won') return styles.statusSuccess;
    if (status === 'lost') return styles.statusError;
    return styles.statusNeutral;
  };

  return (
    <span className={`${styles.statusBadge} ${getVariant()}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function ReasonBadge({ reason }: { reason: string }) {
  return (
    <span className={styles.reasonBadge}>
      {reason.replace(/_/g, ' ')}
    </span>
  );
}

function DeadlineCell({ evidenceDueBy }: { evidenceDueBy: string | null }) {
  if (!evidenceDueBy) {
    return <span className={styles.noDeadline}>—</span>;
  }

  const isUrgent = isDeadlineUrgent(evidenceDueBy);
  
  return (
    <div className={styles.deadlineWrapper}>
      <span className={isUrgent ? styles.deadlineUrgent : styles.deadline}>
        {formatDate(evidenceDueBy)}
      </span>
      {isUrgent && (
        <span className={styles.urgentBadge}>⚠️ Urgent</span>
      )}
    </div>
  );
}

export function getDisputesColumns(): Column<DisputeListItem>[] {
  return [
    {
      id: 'bookingReference',
      header: 'Booking',
      accessor: (row: DisputeListItem) => row.bookingReference,
      sortable: true,
      resizable: true,
      width: '140px',
      cell: (row: DisputeListItem) => (
        <span className={styles.bookingRef}>{row.bookingReference}</span>
      )
    },
    {
      id: 'customerName',
      header: 'Customer',
      accessor: (row: DisputeListItem) => row.customerName,
      sortable: true,
      resizable: true,
      width: '180px'
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: (row: DisputeListItem) => row.amount,
      sortable: true,
      resizable: true,
      width: '120px',
      cell: (row: DisputeListItem) => (
        <span className={styles.amount}>
          {formatCurrency(row.amount, row.currency)}
        </span>
      )
    },
    {
      id: 'reason',
      header: 'Reason',
      accessor: (row: DisputeListItem) => row.reason,
      resizable: true,
      width: '160px',
      cell: (row: DisputeListItem) => <ReasonBadge reason={row.reason} />
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: DisputeListItem) => row.status,
      sortable: true,
      resizable: true,
      width: '150px',
      cell: (row: DisputeListItem) => <StatusBadge status={row.status} />
    },
    {
      id: 'evidenceDueBy',
      header: 'Evidence Due',
      accessor: (row: DisputeListItem) => row.evidenceDueBy || '',
      sortable: true,
      resizable: true,
      width: '180px',
      cell: (row: DisputeListItem) => <DeadlineCell evidenceDueBy={row.evidenceDueBy} />
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row: DisputeListItem) => row.createdAt,
      sortable: true,
      resizable: true,
      width: '130px',
      cell: (row: DisputeListItem) => (
        <span className={styles.date}>{formatDate(row.createdAt)}</span>
      )
    }
  ];
}
