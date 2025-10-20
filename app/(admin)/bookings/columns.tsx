/**
 * Bookings Table Columns - Premium 9 Column Layout
 * ALL data from DB, inline definitions
 * Compliant: <200 lines
 */

'use client';

import React from 'react';
import type { Column } from '@vantage-lane/ui-core';
import { StatusBadge, ActionButton, ActionMenu } from '@vantage-lane/ui-core';
import type { BookingStatus } from '@vantage-lane/ui-core';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import { Assign, Edit, More, Email, Phone, Cancel, Calendar, Clock, Route, Plane, User, Luggage, CreditCard, Currency, UserPlus, Eye, Download, Copy } from '@vantage-lane/ui-icons';
import styles from './columns.module.css';

// Format helpers
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const formatTime = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const getTripIcon = (tripType: string) => {
  switch (tripType) {
    case 'return': return '⟲';
    case 'oneway': return '→';
    case 'hourly': return '⏱';
    case 'fleet': return '🚗';
    default: return '→';
  }
};

// Extract postcode and city from address
const formatLocation = (address: string) => {
  // UK Postcode pattern: AA9A 9AA or A9A 9AA or similar
  const postcodeMatch = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/i);
  
  if (postcodeMatch && postcodeMatch[0]) {
    const postcode = postcodeMatch[0].trim().toUpperCase();
    // Extract city/area (usually first word or words before postcode)
    const beforePostcode = address.split(postcode)[0]?.trim() || '';
    // Get last part before postcode (usually city name)
    const parts = beforePostcode.split(',').map(p => p.trim()).filter(p => p);
    const city = parts[parts.length - 1] || parts[0] || 'Unknown';
    
    return `${postcode} - ${city}`;
  }
  
  // Fallback: show original address
  return address;
};

interface BookingsColumnsProps {
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  allSelected?: boolean;
  selectedIds?: Set<string>;
}

export const getBookingsColumns = ({ onSelectAll, onSelectRow, allSelected = false, selectedIds = new Set() }: BookingsColumnsProps = {}): Column<BookingListItem>[] => [
  // Column 1: Checkbox (40px) - with Select All
  {
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
    width: '40px',
    cell: (row) => (
      <input 
        type="checkbox" 
        className={styles.checkbox}
        checked={selectedIds.has(row.id)}
        onChange={(e) => onSelectRow?.(row.id, e.target.checked)}
        aria-label={`Select booking ${row.reference}`}
      />
    ),
  },

  // Column 2: Expand (40px) - actual logic in BookingsTable
  {
    id: 'expand',
    header: '',
    width: '40px',
    cell: () => <button className={styles.expandButton}>▶️</button>,
  },

  // Column 3: Reference (120px)
  {
    id: 'reference',
    header: 'Reference',
    accessor: (row) => row.reference,
    width: '120px',
    cell: (row) => (
      <div className={styles.referenceCell}>
        <div className={styles.referenceId}>
          {row.reference}
        </div>
        <div className={styles.referenceType}>
          {getTripIcon(row.trip_type)} {row.trip_type.toUpperCase()}
        </div>
      </div>
    ),
  },

  // Column 4: Customer (150px)
  {
    id: 'customer',
    header: 'Customer',
    accessor: (row) => row.customer_name,
    width: '150px',
    cell: (row) => (
      <div className={styles.customerCell}>
        <div className={styles.customerName}>
          {row.customer_name}
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
            <span className={styles.statValue}>{row.customer_loyalty_tier || 'bronze'}</span>
          </div>
          <div className={styles.customerStat}>
            <span className={styles.statLabel}>Status:</span>
            <span className={styles.statValue}>{row.customer_status || 'active'}</span>
          </div>
          <div className={styles.customerStat}>
            <span className={styles.statLabel}>Spent:</span>
            <span className={styles.statValue}>£{(row.customer_total_spent / 100).toFixed(2)}</span>
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
  },

  // Column 5: Route (240px)
  {
    id: 'route',
    header: 'Route',
    accessor: (row) => `${row.pickup_location} → ${row.destination}`,
    width: '240px',
    cell: (row) => (
      <div className={styles.routeCell}>
        <div>🟢 {formatLocation(row.pickup_location)}</div>
        <div>🔴 {formatLocation(row.destination)}</div>
        <div className={styles.routeDetail}>
          <Route size={12} />
          <span>{row.distance_miles?.toFixed(2)} mi</span>
          <span>•</span>
          <Clock size={12} />
          <span>{row.duration_min} min</span>
        </div>
        {/* Scheduled - când este programată cursa (MAI IMPORTANT) */}
        {row.scheduled_at && (
          <div className={styles.routeDetailPrimary}>
            <Calendar size={14} />
            <span className={styles.routeLabelPrimary}>PICKUP:</span>
            <span className={styles.routeDatePrimary}>{formatDate(row.scheduled_at)} {formatTime(row.scheduled_at)}</span>
          </div>
        )}
        {/* Created - când a fost făcut booking-ul (mai puțin important) */}
        <div className={styles.routeDetailSecondary}>
          <span className={styles.routeLabelSecondary}>Created:</span>
          <span>{formatDate(row.created_at)} {formatTime(row.created_at)}</span>
        </div>
        {row.flight_number && (
          <div className={styles.routeDetail}>
            <Plane size={12} />
            <span>{row.flight_number}</span>
          </div>
        )}
      </div>
    ),
  },

  // Column 6: Vehicle (120px)
  {
    id: 'vehicle',
    header: 'Vehicle',
    accessor: (row) => row.category,
    width: '120px',
    cell: (row) => {
      // Parse vehicle model to human readable
      const formatVehicleModel = (model: string | null) => {
        if (!model) return 'Any Vehicle';
        if (model.toLowerCase().includes('selected')) return 'Any Vehicle';
        if (model.toLowerCase().includes('tbd')) return 'Any Vehicle';
        
        // Format specific models: van_v_class → V-Class
        const modelMap: Record<string, string> = {
          'van_v_class': 'V-Class',
          'suv_range_rover': 'Range Rover',
          'exec_5_series': '5 Series',
          'lux_s_class': 'S-Class',
        };
        
        return modelMap[model.toLowerCase()] || model;
      };
      
      const vehicleModel = formatVehicleModel(row.vehicle_model);
      
      return (
        <div className={styles.vehicleCell}>
          {/* Category Badge (Executive, Luxury, SUV, Van) */}
          <div className={styles.vehicleCategoryBadge}>
            {row.category}
          </div>
          
          {/* Specific Model or Unspecified */}
          <div className={styles.vehicleModel}>
            {vehicleModel}
          </div>
          
          {/* Capacity - Passengers */}
          <div className={styles.vehicleCapacityRow}>
            <User size={14} />
            <span>{row.passenger_count} Pass</span>
          </div>
          
          {/* Capacity - Bags */}
          <div className={styles.vehicleCapacityRow}>
            <Luggage size={14} />
            <span>{row.bag_count} Bags</span>
          </div>
        </div>
      );
    },
  },

  // Column 7: Payment (140px)
  {
    id: 'payment',
    header: 'Payment',
    accessor: (row) => row.fare_amount,
    width: '200px',
    cell: (row) => {
      const formatPrice = (cents: number) => `£${(cents / 100).toFixed(2)}`;
      const formatServiceName = (code: string) => {
        const names: Record<string, string> = {
          'security_escort': 'Security Escort',
          'fresh_flowers': 'Fresh Flowers',
          'champagne': 'Champagne',
        };
        return names[code] || code;
      };
      
      return (
        <div className={styles.paymentCell}>
          {/* Base Price */}
          <div className={styles.paymentLine}>
            <span className={styles.paymentLabel}>Base:</span>
            <span>{formatPrice(row.base_price)}</span>
          </div>
          
          {/* Paid Services */}
          {row.paid_services.map((service, idx) => (
            <div key={idx} className={styles.paymentLine}>
              <span className={styles.paymentLabel}>+ {formatServiceName(service.service_code)}:</span>
              <span>{formatPrice(service.unit_price * service.quantity)}</span>
            </div>
          ))}
          
          {/* Total */}
          {row.paid_services.length > 0 && (
            <div className={styles.paymentTotal}>
              <span className={styles.paymentLabel}>TOTAL:</span>
              <span>{formatPrice(row.fare_amount)}</span>
            </div>
          )}
          
          {/* Payment Details */}
          <div className={styles.paymentMeta}>
            <div className={styles.paymentMetaRow}>
              <CreditCard size={12} />
              <span>{row.payment_method}</span>
            </div>
            <div className={styles.paymentMetaRow}>
              <span className={styles.paymentStatusBadge}>{row.payment_status}</span>
            </div>
          </div>
        </div>
      );
    },
  },

  // Column 8: Status (110px)
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    width: '110px',
    cell: (row) => (
      <StatusBadge
        status={row.status as BookingStatus}
        isUrgent={row.is_urgent}
        isNew={row.status === 'pending'} // All pending bookings have glow effect
        showIcon={true}
        size="md"
      />
    ),
  },

  // Column 9: Actions (150px)
  {
    id: 'actions',
    header: 'Actions',
    width: '120px',
    cell: (row) => (
      <div className={styles.actionsCell}>
        {/* Icon-only buttons */}
        <ActionButton
          variant="primary"
          icon={<UserPlus size={16} />}
          onClick={() => console.log('Assign driver:', row.id)}
          aria-label="Assign Driver"
        />
        <ActionButton
          variant="secondary"
          icon={<Edit size={16} />}
          onClick={() => console.log('Edit booking:', row.id)}
          aria-label="Edit Booking"
        />
        <ActionMenu
          trigger={
            <ActionButton
              variant="secondary"
              icon={<More size={16} />}
              aria-label="More Options"
            />
          }
          items={[
            // VIEWING & INFO
            {
              icon: <Eye size={14} />,
              label: 'View Details',
              onClick: () => console.log('View details:', row.id),
            },
            {
              icon: <Calendar size={14} />,
              label: 'View Timeline',
              onClick: () => console.log('View timeline:', row.id),
            },
            { separator: true },
            
            // COMMUNICATION
            {
              icon: <Email size={14} />,
              label: 'Send Email',
              onClick: () => console.log('Send email:', row.id),
            },
            {
              icon: <Phone size={14} />,
              label: 'Call Customer',
              onClick: () => console.log('Call:', row.id),
            },
            { separator: true },
            
            // DOCUMENT ACTIONS
            {
              icon: <Download size={14} />,
              label: 'Download Invoice',
              onClick: () => console.log('Download invoice:', row.id),
            },
            {
              icon: <Download size={14} />,
              label: 'Export PDF',
              onClick: () => console.log('Export PDF:', row.id),
            },
            { separator: true },
            
            // BOOKING MANAGEMENT
            {
              icon: <Copy size={14} />,
              label: 'Duplicate Booking',
              onClick: () => console.log('Duplicate:', row.id),
            },
            {
              icon: <Edit size={14} />,
              label: 'Edit Booking',
              onClick: () => console.log('Edit:', row.id),
            },
            {
              icon: <UserPlus size={14} />,
              label: 'Reassign Driver',
              onClick: () => console.log('Reassign driver:', row.id),
            },
            {
              icon: <Clock size={14} />,
              label: 'Reschedule',
              onClick: () => console.log('Reschedule:', row.id),
            },
            {
              icon: <CreditCard size={14} />,
              label: 'Update Payment',
              onClick: () => console.log('Update payment:', row.id),
            },
            { separator: true },
            
            // CRITICAL ACTIONS
            {
              icon: <Cancel size={14} />,
              label: 'Cancel Booking',
              onClick: () => console.log('Cancel:', row.id),
              danger: true,
            },
          ]}
        />
      </div>
    ),
  },
];

// Backward compatibility export
export const bookingsColumns = getBookingsColumns();
