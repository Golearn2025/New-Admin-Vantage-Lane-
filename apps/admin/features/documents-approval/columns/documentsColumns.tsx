/**
 * Documents Approval - Column Definitions
 * Table columns for documents approval
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

import React from 'react';
import type { Document } from '@entities/document';
import type { Column, RowAction } from '@vantage-lane/ui-core';
import { RowActions } from '@vantage-lane/ui-core';
import { getDocumentLabel } from '@entities/document';
import styles from './documentsColumns.module.css';

export interface DocumentColumnsCallbacks {
  onView?: (document: Document) => void;
  onApprove?: (document: Document) => void;
  onReject?: (document: Document) => void;
}

// Driver Name column
function getDriverColumn(): Column<Document> {
  return {
    id: 'driver',
    header: 'Driver/Operator',
    accessor: (row) => row.userName,
    cell: (row) => (
      <div className={styles.driverCell}>
        <span className={styles.driverName}>{row.userName}</span>
        <span className={styles.driverEmail}>{row.userEmail}</span>
      </div>
    ),
    sortable: true,
    width: '200px',
  };
}

// Document Type column
function getDocumentTypeColumn(): Column<Document> {
  return {
    id: 'type',
    header: 'Document Type',
    accessor: (row) => getDocumentLabel(row.type),
    cell: (row) => (
      <div className={styles.typeCell}>
        <span className={styles.typeName}>{getDocumentLabel(row.type)}</span>
        <span className={styles.typeCategory}>{row.category}</span>
      </div>
    ),
    sortable: true,
    width: '220px',
  };
}

// Status column
function getStatusColumn(): Column<Document> {
  return {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    cell: (row) => {
      const statusClass = `status${row.status.charAt(0).toUpperCase() + row.status.slice(1).replace('_', '')}`;
      return (
        <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
          {row.status.replace('_', ' ')}
        </span>
      );
    },
    sortable: true,
    width: '130px',
  };
}

// Upload Date column
function getUploadDateColumn(): Column<Document> {
  return {
    id: 'uploadDate',
    header: 'Uploaded',
    accessor: (row) => row.uploadDate,
    cell: (row) => {
      const date = new Date(row.uploadDate);
      return (
        <span className={styles.date}>
          {date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
    },
    sortable: true,
    width: '120px',
  };
}

// Expiry Date column
function getExpiryDateColumn(): Column<Document> {
  return {
    id: 'expiryDate',
    header: 'Expires',
    accessor: (row) => row.expiryDate || '—',
    cell: (row) => {
      if (!row.expiryDate) {
        return <span className={styles.noExpiry}>—</span>;
      }
      
      const date = new Date(row.expiryDate);
      const now = new Date();
      const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let className = styles.expiryNormal;
      if (daysLeft <= 0) className = styles.expiryExpired;
      else if (daysLeft <= 30) className = styles.expiryWarning;
      
      return (
        <span className={className}>
          {date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
    },
    sortable: true,
    width: '120px',
  };
}

// Actions column
function getActionsColumn(callbacks: DocumentColumnsCallbacks = {}): Column<Document> {
  return {
    id: 'actions',
    header: 'Actions',
    accessor: () => '',
    cell: (row) => {
      const actions: RowAction[] = [];
      
      if (callbacks.onView) {
        actions.push({
          label: 'View Document',
          icon: 'eye',
          onClick: () => callbacks.onView?.(row),
        });
      }
      
      if (row.status === 'pending' && callbacks.onApprove) {
        actions.push({
          label: 'Approve',
          icon: 'edit',
          onClick: () => callbacks.onApprove?.(row),
        });
      }
      
      if (row.status === 'pending' && callbacks.onReject) {
        actions.push({
          label: 'Reject',
          icon: 'trash',
          onClick: () => callbacks.onReject?.(row),
          variant: 'danger',
        });
      }
      
      return <RowActions actions={actions} />;
    },
    sortable: false,
    width: '80px',
  };
}

export function getDocumentsColumns(
  callbacks: DocumentColumnsCallbacks = {}
): Column<Document>[] {
  return [
    getDriverColumn(),
    getDocumentTypeColumn(),
    getStatusColumn(),
    getUploadDateColumn(),
    getExpiryDateColumn(),
    getActionsColumn(callbacks),
  ];
}
