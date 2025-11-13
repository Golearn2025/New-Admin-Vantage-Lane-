/**
 * Document Columns for Driver Profile
 * 
 * Column definitions for documents table in driver profile
 */

import React from 'react';
import type { DocumentData, DocumentStatus } from '@entities/driver';
import type { Column, RowAction } from '@vantage-lane/ui-core';
import { RowActions, Badge } from '@vantage-lane/ui-core';
import { FileText, Eye } from 'lucide-react';
import styles from './documentColumns.module.css';

export interface DocumentColumnsCallbacks {
  onView?: (document: DocumentData) => void;
  onApprove?: (document: DocumentData) => void;
  onReject?: (document: DocumentData) => void;
}

/**
 * Get document type column
 */
export function getDocumentTypeColumn(): Column<DocumentData> {
  return {
    id: 'documentType',
    header: 'Document Type',
    accessor: (row) => row.documentType,
    cell: (row) => (
      <div className={styles.typeCell}>
        <FileText size={16} />
        <span>{row.documentType}</span>
      </div>
    ),
    sortable: true,
    width: '150px',
  };
}

/**
 * Get upload date column
 */
export function getUploadDateColumn(): Column<DocumentData> {
  return {
    id: 'uploadDate',
    header: 'Upload Date',
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

/**
 * Check if date is expiring soon (within 30 days)
 */
function isExpiringSoon(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
}

/**
 * Get expiry date column with badge for expiring soon
 */
export function getExpiryDateColumn(): Column<DocumentData> {
  return {
    id: 'expiryDate',
    header: 'Expiry Date',
    accessor: (row) => row.expiryDate || '—',
    cell: (row) => {
      if (!row.expiryDate) {
        return <span className={styles.noExpiry}>—</span>;
      }

      const date = new Date(row.expiryDate);
      const expiring = isExpiringSoon(row.expiryDate);

      return (
        <div className={styles.expiryCell}>
          <span className={styles.date}>
            {date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          {expiring && (
            <Badge color="danger" size="sm">
              Expiring Soon
            </Badge>
          )}
        </div>
      );
    },
    sortable: true,
    width: '160px',
  };
}

/**
 * Get status column
 */
export function getStatusColumn(): Column<DocumentData> {
  return {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    cell: (row) => {
      const colorMap: Record<DocumentStatus, 'warning' | 'success' | 'danger' | 'neutral' | 'info'> = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        expired: 'danger',
        expiring_soon: 'warning',
        replaced: 'neutral',
      };

      const color = colorMap[row.status] || 'neutral';
      
      return (
        <div className={styles.statusCell}>
          <Badge color={color} size="sm">
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
          {row.status === 'rejected' && row.rejectionReason && (
            <span className={styles.rejectionReason} title={row.rejectionReason}>
              {row.rejectionReason}
            </span>
          )}
        </div>
      );
    },
    sortable: true,
    width: '200px',
  };
}

/**
 * Get actions column
 */
export function getActionsColumn(
  callbacks: DocumentColumnsCallbacks = {}
): Column<DocumentData> {
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

/**
 * Get all document columns
 */
export function getDocumentColumns(
  callbacks: DocumentColumnsCallbacks = {}
): Column<DocumentData>[] {
  return [
    getDocumentTypeColumn(),
    getUploadDateColumn(),
    getExpiryDateColumn(),
    getStatusColumn(),
    getActionsColumn(callbacks),
  ];
}
