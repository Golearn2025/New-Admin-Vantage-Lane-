/**
 * Invoices Table Columns
 * Column definitions cu actions premium
 * < 150 lines - RULES.md compliant
 */

import React from 'react';
import type { InvoiceListItem } from '@entities/invoice';
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

function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case 'paid': return styles.statusSuccess;
      case 'sent': return styles.statusWarning;
      case 'draft': return styles.statusNeutral;
      case 'void': return styles.statusError;
      case 'overdue': return styles.statusError;
      default: return styles.statusNeutral;
    }
  };

  return (
    <span className={`${styles.statusBadge} ${getVariant()}`}>
      {status}
    </span>
  );
}

export function getInvoicesColumns(): Column<InvoiceListItem>[] {
  return [
    {
      id: 'invoiceNumber',
      header: 'Invoice #',
      accessor: (row: InvoiceListItem) => row.invoiceNumber,
      sortable: true,
      resizable: true,
      width: '140px',
      cell: (row: InvoiceListItem) => (
        <span className={styles.invoiceNumber}>
          {row.invoiceNumber}
        </span>
      )
    },
    {
      id: 'bookingReference',
      header: 'Booking',
      accessor: (row: InvoiceListItem) => row.bookingReference,
      sortable: true,
      resizable: true,
      width: '140px',
      cell: (row: InvoiceListItem) => (
        <span className={styles.bookingRef}>
          {row.bookingReference}
        </span>
      )
    },
    {
      id: 'customerName',
      header: 'Customer',
      accessor: (row: InvoiceListItem) => row.customerName,
      sortable: true,
      resizable: true,
      width: '180px'
    },
    {
      id: 'total',
      header: 'Total',
      accessor: (row: InvoiceListItem) => row.total,
      sortable: true,
      resizable: true,
      width: '120px',
      cell: (row: InvoiceListItem) => (
        <span className={styles.amount}>
          {formatCurrency(row.total, row.currency)}
        </span>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: InvoiceListItem) => row.status,
      sortable: true,
      resizable: true,
      width: '120px',
      cell: (row: InvoiceListItem) => <StatusBadge status={row.status} />
    },
    {
      id: 'dueDate',
      header: 'Due Date',
      accessor: (row: InvoiceListItem) => row.dueDate,
      sortable: true,
      resizable: true,
      width: '130px',
      cell: (row: InvoiceListItem) => (
        <span className={styles.date}>
          {formatDate(row.dueDate)}
        </span>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (row: InvoiceListItem) => row.createdAt,
      sortable: true,
      resizable: true,
      width: '130px',
      cell: (row: InvoiceListItem) => (
        <span className={styles.date}>
          {formatDate(row.createdAt)}
        </span>
      )
    }
  ];
}
