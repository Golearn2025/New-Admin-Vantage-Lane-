/**
 * Bookings Columns - Actions Column
 */

'use client';

import { ActionMenu } from '@vantage-lane/ui-core';
import { UserPlus, Pencil, MoreHorizontal, Eye, Calendar, Clock, Mail, Phone, Download, Copy, CreditCard, X } from 'lucide-react';
import styles from './columns.module.css';
import type { BookingColumn } from './schema';

const __DEV__ = process.env.NODE_ENV !== 'production';

export const getActionsColumn = (): BookingColumn => ({
  id: 'actions',
  header: 'Actions',
  width: '120px',
  align: 'center',
  cell: (row) => (
    <div className={styles.actionsCell}>
      {/* Fixed-size buttons with lucide-react icons */}
      <button
        type="button"
        className={`${styles.btnFixed} ${styles.btn88x28} ${styles.btnPrimary}`}
        onClick={() => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.debug('Assign driver:', row.id);
          }
        }}
        aria-label="Assign Driver"
      >
        <span className={styles.icon}>
          <UserPlus size={12} strokeWidth={2} />
        </span>
        <span className={styles.label}>Assign</span>
      </button>

      <button
        type="button"
        className={`${styles.btnFixed} ${styles.btn88x28} ${styles.btnSecondary}`}
        onClick={() => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.debug('Edit booking:', row.id);
          }
        }}
        aria-label="Edit Booking"
      >
        <span className={styles.icon}>
          <Pencil size={12} strokeWidth={2} />
        </span>
        <span className={styles.label}>Edit</span>
      </button>

      <ActionMenu
        position="bottom-right"
        trigger={
          <button
            type="button"
            className={`${styles.btnFixed} ${styles.btn88x28} ${styles.btnSecondary}`}
            aria-label="More Options"
          >
            <span className={styles.icon}>
              <MoreHorizontal size={12} strokeWidth={2} />
            </span>
            <span className={styles.label}>More</span>
          </button>
        }
        items={[
          // VIEWING & INFO
          {
            icon: <Eye size={14} strokeWidth={2} />,
            label: 'View Details',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('View details:', row.id);
              }
            },
          },
          {
            icon: <Calendar size={14} strokeWidth={2} />,
            label: 'View Timeline',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('View timeline:', row.id);
              }
            },
          },
          { separator: true },

          // COMMUNICATION
          {
            icon: <Mail size={14} strokeWidth={2} />,
            label: 'Send Email',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Send email:', row.id);
              }
            },
          },
          {
            icon: <Phone size={14} strokeWidth={2} />,
            label: 'Call Customer',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Call:', row.id);
              }
            },
          },
          { separator: true },

          // DOCUMENT ACTIONS
          {
            icon: <Download size={14} strokeWidth={2} />,
            label: 'Download Invoice',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Download invoice:', row.id);
              }
            },
          },
          {
            icon: <Download size={14} strokeWidth={2} />,
            label: 'Export PDF',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Export PDF:', row.id);
              }
            },
          },
          { separator: true },

          // BOOKING MANAGEMENT
          {
            icon: <Copy size={14} strokeWidth={2} />,
            label: 'Duplicate Booking',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Duplicate:', row.id);
              }
            },
          },
          {
            icon: <Pencil size={14} strokeWidth={2} />,
            label: 'Edit Booking',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Edit:', row.id);
              }
            },
          },
          {
            icon: <UserPlus size={14} strokeWidth={2} />,
            label: 'Reassign Driver',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Reassign driver:', row.id);
              }
            },
          },
          {
            icon: <Clock size={14} strokeWidth={2} />,
            label: 'Reschedule',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Reschedule:', row.id);
              }
            },
          },
          {
            icon: <CreditCard size={14} strokeWidth={2} />,
            label: 'Update Payment',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Update payment:', row.id);
              }
            },
          },
          { separator: true },

          // CRITICAL ACTIONS
          {
            icon: <X size={14} strokeWidth={2} />,
            label: 'Cancel Booking',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Cancel:', row.id);
              }
            },
            danger: true,
          },
        ]}
      />
    </div>
  ),
});
