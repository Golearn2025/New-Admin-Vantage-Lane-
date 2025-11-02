/**
 * Bookings Columns - Detailed Cell Renderers
 * (Route, Vehicle, Payment, Status)
 */

'use client';

import React from 'react';
import { StatusBadge } from '@vantage-lane/ui-core';
import type { BookingStatus } from '@vantage-lane/ui-core';
import { Route, Clock, Calendar, Plane, User, Luggage, CreditCard, Circle } from 'lucide-react';
import { VehicleChip } from './VehicleChip';
import {
  formatDate,
  formatTime,
  formatLocation,
  formatPrice,
  formatServiceName,
  formatVehicleModel,
} from './helpers';
import styles from './columns.module.css';
import type { BookingColumn } from './schema';

export const getRouteColumn = (): BookingColumn => ({
  id: 'route',
  header: 'Route',
  accessor: (row) => `${row.pickup_location} → ${row.destination}`,
  width: '180px',
  align: 'left',
  cell: (row) => (
    <div className={styles.routeCell}>
      <div className={styles.routeLocation}>
        <Circle size={10} fill="#10b981" stroke="#10b981" />
        <span>{formatLocation(row.pickup_location)}</span>
      </div>
      <div className={styles.routeLocation}>
        <Circle size={10} fill="#ef4444" stroke="#ef4444" />
        <span>{formatLocation(row.destination)}</span>
      </div>
      <div className={styles.routeDetail}>
        <Route size={13} />
        <span>{row.distance_miles?.toFixed(2)} mi</span>
        <span>•</span>
        <Clock size={13} />
        <span>{row.duration_min} min</span>
      </div>
      {row.scheduled_at && (
        <div className={styles.routeDetailPrimary}>
          <Calendar size={13} />
          <span className={styles.routeLabelPrimary}>PICKUP:</span>
          <span className={styles.routeDatePrimary}>
            {formatDate(row.scheduled_at)} {formatTime(row.scheduled_at)}
          </span>
        </div>
      )}
      <div className={styles.routeDetailSecondary}>
        <span className={styles.routeLabelSecondary}>Created:</span>
        <span>
          {formatDate(row.created_at)} {formatTime(row.created_at)}
        </span>
      </div>
      {row.flight_number && (
        <div className={styles.routeDetail}>
          <Plane size={13} />
          <span>{row.flight_number}</span>
        </div>
      )}
    </div>
  ),
});

export const getVehicleColumn = (): BookingColumn => ({
  id: 'vehicle',
  header: 'Vehicle',
  accessor: (row) => row.category,
  width: '100px',
  align: 'left',
  cell: (row) => {
    const vehicleModel = formatVehicleModel(row.vehicle_model);

    return (
      <div className={styles.vehicleCell}>
        <VehicleChip category={row.category as any} size="sm" />
        <div className={styles.vehicleModel}>{vehicleModel}</div>
        <div className={styles.vehicleCapacityRow}>
          <User size={13} />
          <span>{row.passenger_count} Pass</span>
        </div>
        <div className={styles.vehicleCapacityRow}>
          <Luggage size={13} />
          <span>{row.bag_count} Bags</span>
        </div>
      </div>
    );
  },
});

export const getPaymentColumn = (): BookingColumn => ({
  id: 'payment',
  header: 'Payment',
  accessor: (row) => row.fare_amount,
  width: '160px',
  align: 'left',
  cell: (row) => (
    <div className={styles.paymentCell}>
      <div className={styles.paymentLine}>
        <span className={styles.paymentLabel}>Base:</span>
        <span>{formatPrice(row.base_price)}</span>
      </div>
      {row.paid_services.map((service, idx) => (
        <div key={idx} className={styles.paymentLine}>
          <span className={styles.paymentLabel}>+ {formatServiceName(service.service_code)}:</span>
          <span>{formatPrice(service.unit_price * service.quantity)}</span>
        </div>
      ))}
      {row.paid_services.length > 0 && (
        <div className={styles.paymentTotal}>
          <span className={styles.paymentLabel}>TOTAL:</span>
          <span>{formatPrice(row.fare_amount)}</span>
        </div>
      )}
      <div className={styles.paymentMeta}>
        <div className={styles.paymentMetaRow}>
          <CreditCard size={13} />
          <span>{row.payment_method}</span>
        </div>
        <div className={styles.paymentMetaRow}>
          <span className={styles.paymentStatusBadge}>{row.payment_status}</span>
        </div>
      </div>
    </div>
  ),
});

export const getStatusColumn = (): BookingColumn => ({
  id: 'status',
  header: 'Status',
  accessor: (row) => row.status,
  width: '110px',
  align: 'center',
  cell: (row) => (
    <StatusBadge
      status={row.status as BookingStatus}
      isUrgent={row.is_urgent}
      isNew={row.status === 'pending'}  // ✅ NEW = status pending (neasignat încă)
      showIcon={true}
      size="md"
    />
  ),
});
