/**
 * Bookings Columns - Actions Column
 */

'use client';

import React from 'react';
import { ActionButton, ActionMenu } from '@vantage-lane/ui-core';
import {
  Edit,
  More,
  Email,
  Phone,
  Cancel,
  Calendar,
  Clock,
  UserPlus,
  Eye,
  Download,
  Copy,
  CreditCard,
} from '@vantage-lane/ui-icons';
import styles from '../columns.module.css';
import type { BookingColumn } from './schema';

const __DEV__ = process.env.NODE_ENV !== 'production';

export const getActionsColumn = (): BookingColumn => ({
  id: 'actions',
  header: 'Actions',
  width: '120px',
  cell: (row) => (
    <div className={styles.actionsCell}>
      {/* Icon-only buttons */}
      <ActionButton
        variant="primary"
        icon={<UserPlus size={16} />}
        onClick={() => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.debug('Assign driver:', row.id);
          }
        }}
        aria-label="Assign Driver"
      />
      <ActionButton
        variant="secondary"
        icon={<Edit size={16} />}
        onClick={() => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.debug('Edit booking:', row.id);
          }
        }}
        aria-label="Edit Booking"
      />
      <ActionMenu
        trigger={
          <ActionButton variant="secondary" icon={<More size={16} />} aria-label="More Options" />
        }
        items={[
          // VIEWING & INFO
          {
            icon: <Eye size={14} />,
            label: 'View Details',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('View details:', row.id);
              }
            },
          },
          {
            icon: <Calendar size={14} />,
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
            icon: <Email size={14} />,
            label: 'Send Email',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Send email:', row.id);
              }
            },
          },
          {
            icon: <Phone size={14} />,
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
            icon: <Download size={14} />,
            label: 'Download Invoice',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Download invoice:', row.id);
              }
            },
          },
          {
            icon: <Download size={14} />,
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
            icon: <Copy size={14} />,
            label: 'Duplicate Booking',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Duplicate:', row.id);
              }
            },
          },
          {
            icon: <Edit size={14} />,
            label: 'Edit Booking',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Edit:', row.id);
              }
            },
          },
          {
            icon: <UserPlus size={14} />,
            label: 'Reassign Driver',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Reassign driver:', row.id);
              }
            },
          },
          {
            icon: <Clock size={14} />,
            label: 'Reschedule',
            onClick: () => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.debug('Reschedule:', row.id);
              }
            },
          },
          {
            icon: <CreditCard size={14} />,
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
            icon: <Cancel size={14} />,
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
