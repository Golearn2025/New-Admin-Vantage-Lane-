/**
 * Bookings Columns - Basic Cell Renderers
 * (Select, Expand, Reference, Customer)
 */

'use client';

import { Badge } from '@vantage-lane/ui-core';
import { Email, Phone } from '@vantage-lane/ui-icons';
import { Award, ChevronRight, Crown, Gem, Medal, Star } from 'lucide-react';
import React from 'react';
import styles from './columns.module.css';
import { getTripIcon, getTripTypeColor } from './helpers';
import type { BookingColumn, BookingsColumnsProps } from './schema';

const TIER_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  bronze:   { icon: <Medal size={14} />,  color: '#CD7F32', label: 'Bronze' },
  silver:   { icon: <Award size={14} />,  color: '#A8A9AD', label: 'Silver' },
  gold:     { icon: <Crown size={14} />,  color: '#FFD700', label: 'Gold' },
  platinum: { icon: <Gem size={14} />,    color: '#7B68EE', label: 'Platinum' },
};

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
  width: '32px',
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
  width: '32px',
  cell: () => <button className={styles.expandButton}><ChevronRight size={16} /></button>,
});

export const getReferenceColumn = (): BookingColumn => ({
  id: 'reference',
  header: 'Reference',
  accessor: (row) => row.reference,
  width: '100px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => (
    <div className={styles.referenceCell}>
      <div className={styles.referenceId}>{row.reference}</div>
      <div className={styles.referenceType}>
        <Badge 
          color={getTripTypeColor(row.trip_type)}
          variant="solid" 
          size="sm"
        >
          {getTripIcon(row.trip_type)} {row.trip_type.toUpperCase()}
        </Badge>
      </div>
    </div>
  ),
});

export const getCustomerColumn = (): BookingColumn => ({
  id: 'customer',
  header: 'Customer',
  accessor: (row) => row.customer_name,
  width: '120px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => (
    <div className={styles.customerCell}>
      <div className={styles.customerNameRow}>
        <div className={styles.customerName}>{row.customer_name}</div>
        {row.customer_rating_average != null && (
          <div className={styles.customerRating}>
            <Star size={12} fill="#FFD700" stroke="#FFD700" />
            <span>{Number(row.customer_rating_average).toFixed(1)}</span>
          </div>
        )}
      </div>
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
          <span className={styles.statValue} style={{ color: TIER_CONFIG[row.customer_loyalty_tier || 'bronze']?.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {TIER_CONFIG[row.customer_loyalty_tier || 'bronze']?.icon}
            {TIER_CONFIG[row.customer_loyalty_tier || 'bronze']?.label}
          </span>
        </div>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Status:</span>
          <span className={styles.statValue} style={{ color: (row.customer_status || 'active') === 'active' ? '#22c55e' : (row.customer_status === 'suspended' ? '#ef4444' : '#9ca3af') }}>
            {(row.customer_status || 'active').charAt(0).toUpperCase() + (row.customer_status || 'active').slice(1)}
          </span>
        </div>
        <div className={styles.customerStat}>
          <span className={styles.statLabel}>Spent:</span>
          <span className={styles.statValue} style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>
            £{Number(row.customer_total_spent).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
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
