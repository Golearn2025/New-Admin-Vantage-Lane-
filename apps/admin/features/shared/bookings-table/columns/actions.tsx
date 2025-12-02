'use client';

import { ActionMenu, Button } from '@vantage-lane/ui-core';
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
      {/* UI-Core Button components */}
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          // TODO: Implement assign driver
        }}
        aria-label="Assign Driver"
      >
        <UserPlus size={16} strokeWidth={2} />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          // TODO: Implement edit booking
        }}
        aria-label="Edit Booking"
      >
        <Pencil size={16} strokeWidth={2} />
      </Button>

      <ActionMenu
        position="bottom-right"
        trigger={
          <Button
            variant="secondary"
            size="sm"
            aria-label="More Options"
          >
            <MoreHorizontal size={16} strokeWidth={2} />
          </Button>
        }
        items={[
          // VIEWING & INFO
          {
            icon: <Eye size={14} strokeWidth={2} />,
            label: 'View Details',
            onClick: () => {
              // TODO: Implement view details
            },
          },
          {
            icon: <Calendar size={14} strokeWidth={2} />,
            label: 'View Timeline',
            onClick: () => {
              // TODO: Implement view timeline
            },
          },
          { separator: true },

          // COMMUNICATION
          {
            icon: <Mail size={14} strokeWidth={2} />,
            label: 'Send Email',
            onClick: () => {
              // TODO: Implement send email
            },
          },
          {
            icon: <Phone size={14} strokeWidth={2} />,
            label: 'Call Customer',
            onClick: () => {
              // TODO: Implement call customer
            },
          },
          { separator: true },

          // DOCUMENT ACTIONS
          {
            icon: <Download size={14} strokeWidth={2} />,
            label: 'Download Invoice',
            onClick: () => {
              // TODO: Implement download invoice
            },
          },
          {
            icon: <Download size={14} strokeWidth={2} />,
            label: 'Export PDF',
            onClick: () => {
              // TODO: Implement export PDF
            },
          },
          { separator: true },

          // BOOKING MANAGEMENT
          {
            icon: <Copy size={14} strokeWidth={2} />,
            label: 'Duplicate Booking',
            onClick: () => {
              // TODO: Implement duplicate booking
            },
          },
          {
            icon: <Pencil size={14} strokeWidth={2} />,
            label: 'Edit Booking',
            onClick: () => {
              // TODO: Implement edit booking
            },
          },
          {
            icon: <UserPlus size={14} strokeWidth={2} />,
            label: 'Reassign Driver',
            onClick: () => {
              // TODO: Implement reassign driver
            },
          },
          {
            icon: <Clock size={14} strokeWidth={2} />,
            label: 'Reschedule',
            onClick: () => {
              // TODO: Implement reschedule
            },
          },
          {
            icon: <CreditCard size={14} strokeWidth={2} />,
            label: 'Update Payment',
            onClick: () => {
              // TODO: Implement update payment
            },
          },
          { separator: true },

          // CRITICAL ACTIONS
          {
            icon: <X size={14} strokeWidth={2} />,
            label: 'Cancel Booking',
            onClick: () => {
              // TODO: Implement cancel booking
            },
            danger: true,
          },
        ]}
      />
    </div>
  ),
});
