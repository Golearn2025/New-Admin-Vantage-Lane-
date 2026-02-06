/**
 * Bookings Columns - Detailed Cell Renderers
 * (Route, Vehicle, Payment, Status)
 */

'use client';

import type { BookingStatus } from '@vantage-lane/ui-core';
import { StatusBadge } from '@vantage-lane/ui-core';
import { Calendar, Car, Clock, CreditCard, Luggage, MapPin, Plane, Route, Timer, User } from 'lucide-react';
import styles from './columns.module.css';
import {
    formatDate,
    formatLocation,
    formatPrice,
    formatTime,
    formatVehicleModel
} from './helpers';
import type { BookingColumn } from './schema';
import { VehicleChip, type VehicleCategory } from './VehicleChip';

export const getRouteColumn = (): BookingColumn => ({
  id: 'route',
  header: 'Route',
  accessor: (row) => `${row.pickup_location} → ${row.destination}`,
  width: '180px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => {
    // Extract hours/days from destination text like "Multiple destinations - 8 hour hire"
    const hoursMatch = row.destination?.match(/(\d+)\s*hour/i);
    const daysMatch = row.destination?.match(/(\d+)\s*day/i);
    const hours = hoursMatch?.[1] ? parseInt(hoursMatch[1], 10) : null;
    const days = daysMatch?.[1] ? parseInt(daysMatch[1], 10) : null;
    const isHourlyOrDaily = row.trip_type === 'hourly' || row.trip_type === 'daily';

    return (
      <div className={styles.routeCell}>
        {/* Pickup - always shown */}
        <div className={styles.routeLocation}>
          <MapPin size={14} className={styles.pickupIcon} />
          <span>{formatLocation(row.pickup_location)}</span>
        </div>

        {/* Destination - only for oneway/return/fleet */}
        {!isHourlyOrDaily && (
          <div className={styles.routeLocation}>
            <MapPin size={14} className={styles.destinationIcon} />
            <span>{formatLocation(row.destination)}</span>
          </div>
        )}

        {/* Hourly: show hours */}
        {row.trip_type === 'hourly' && hours && (
          <div className={styles.routeDetail}>
            <Timer size={13} />
            <span style={{ fontWeight: 600 }}>{hours}h hire</span>
          </div>
        )}

        {/* Daily: show days */}
        {row.trip_type === 'daily' && days && (
          <div className={styles.routeDetail}>
            <Calendar size={13} />
            <span style={{ fontWeight: 600 }}>{days} day{days > 1 ? 's' : ''} hire</span>
          </div>
        )}

        {/* Distance & duration */}
        {(row.distance_miles || row.duration_min) && (
          <div className={styles.routeDetail}>
            <Route size={13} />
            <span>{row.distance_miles?.toFixed(1) || '0.0'} mi</span>
            <span>•</span>
            <Clock size={13} />
            <span>{row.duration_min || 0} min</span>
          </div>
        )}

        {/* Pickup date/time */}
        {row.scheduled_at && (
          <div className={styles.routeDetailPrimary}>
            <Calendar size={13} />
            <span className={styles.routeLabelPrimary}>PICKUP:</span>
            <span className={styles.routeDatePrimary}>
              {formatDate(row.scheduled_at)} {formatTime(row.scheduled_at)}
            </span>
          </div>
        )}

        {/* Created date */}
        <div className={styles.routeDetailSecondary}>
          <span className={styles.routeLabelSecondary}>Created:</span>
          <span>
            {formatDate(row.created_at)} {formatTime(row.created_at)}
          </span>
        </div>

        {/* Flight number */}
        {row.flight_number && (
          <div className={styles.routeDetail}>
            <Plane size={13} />
            <span>{row.flight_number}</span>
          </div>
        )}

        {/* Passengers & bags */}
        {(row.passenger_count || row.bag_count) && (
          <div className={styles.routeDetail}>
            <User size={13} />
            <span>{row.passenger_count || 0} pax</span>
            <span>•</span>
            <Luggage size={13} />
            <span>{row.bag_count || 0} bags</span>
          </div>
        )}
      </div>
    );
  },
});

export const getVehicleColumn = (): BookingColumn => ({
  id: 'vehicle',
  header: 'Vehicle',
  accessor: (row) => row.category,
  width: '140px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => {
    const customerChoice = formatVehicleModel(row.vehicle_model, row.category);
    const hasAssigned = !!row.vehicle_make || !!row.vehicle_model_name;
    const assignedLabel = hasAssigned
      ? [row.vehicle_make, row.vehicle_model_name].filter(Boolean).join(' ')
      : null;

    return (
      <div className={styles.vehicleCell}>
        <VehicleChip category={row.category as VehicleCategory} size="sm" />
        <div className={styles.vehicleModel}>{customerChoice}</div>
        {hasAssigned && (
          <div className={styles.vehicleAssigned}>
            <Car size={13} />
            <span>{assignedLabel}</span>
            {row.vehicle_year && <span>({row.vehicle_year})</span>}
          </div>
        )}
        {row.vehicle_color && (
          <div className={styles.vehicleDetail}>
            <span>{row.vehicle_color}</span>
          </div>
        )}
        {row.vehicle_plate && (
          <div className={styles.vehiclePlate}>
            <span>{row.vehicle_plate}</span>
          </div>
        )}
        {!hasAssigned && row.status !== 'completed' && row.status !== 'cancelled' && (
          <div className={styles.vehicleUnassigned}>
            <span>Awaiting assignment</span>
          </div>
        )}
      </div>
    );
  },
});

export const getPaymentColumn = (): BookingColumn => ({
  id: 'payment',
  header: 'Payment',
  accessor: (row) => row.fare_amount,
  width: '170px',
  align: 'left',
  resizable: true,
  sortable: true,
  cell: (row) => (
    <div className={styles.paymentCell}>
      <div className={styles.paymentLineTotal}>
        <span className={styles.paymentLabel}>Total:</span>
        <span className={styles.paymentValue}>{formatPrice(row.fare_amount)} {row.currency}</span>
      </div>
      <div className={styles.paymentLine}>
        <span className={styles.paymentLabel}>Base:</span>
        <span>{formatPrice(row.base_price)}</span>
      </div>
      <div className={styles.paymentLine}>
        <span className={styles.paymentLabel}>Platform {row.platform_commission_pct != null ? <span className={styles.paymentPct}>({row.platform_commission_pct}%)</span> : ''}:</span>
        <span className={styles.paymentEarned}>{formatPrice(row.platform_fee)}</span>
      </div>
      <div className={styles.paymentLine}>
        <span className={styles.paymentLabel}>Operator {row.driver_commission_pct != null ? <span className={styles.paymentPct}>({row.driver_commission_pct}%)</span> : ''}:</span>
        <span className={styles.paymentEarned}>{row.driver_commission_pct != null && row.operator_net ? formatPrice((row.operator_net * row.driver_commission_pct) / 100) : '—'}</span>
      </div>
      <div className={styles.paymentLine}>
        <span className={styles.paymentLabel}>Driver:</span>
        <span className={styles.paymentDriver}>{formatPrice(row.driver_payout)}</span>
      </div>
      <div className={styles.paymentMeta}>
        <div className={styles.paymentMetaRow}>
          <CreditCard size={13} />
          <span>{row.payment_method || 'N/A'}</span>
        </div>
        <div className={styles.paymentMetaRow}>
          <span className={styles.paymentStatusBadge}>{row.payment_status || 'pending'}</span>
        </div>
      </div>
    </div>
  ),
});

export const getStatusColumn = (): BookingColumn => ({
  id: 'status',
  header: 'Status',
  accessor: (row) => row.status,
  width: '150px',
  align: 'center',
  resizable: true,
  sortable: true,
  cell: (row) => (
    <div className={styles.statusCell}>
      <StatusBadge
        status={row.status as BookingStatus}
        isUrgent={row.is_urgent}
        isNew={row.is_new}
        showIcon={true}
        size="md"
      />
      <div className={styles.statusTimestamps}>
        {row.assigned_at && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Assigned:</span>
            <span>{formatDate(row.assigned_at)} {formatTime(row.assigned_at)}</span>
          </div>
        )}
        {row.arrived_at_pickup && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Arrived:</span>
            <span>{formatDate(row.arrived_at_pickup)} {formatTime(row.arrived_at_pickup)}</span>
          </div>
        )}
        {row.passenger_onboard_at && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Onboard:</span>
            <span>{formatDate(row.passenger_onboard_at)} {formatTime(row.passenger_onboard_at)}</span>
          </div>
        )}
        {row.started_at && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Started:</span>
            <span>{formatDate(row.started_at)} {formatTime(row.started_at)}</span>
          </div>
        )}
        {row.completed_at && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Done:</span>
            <span>{formatDate(row.completed_at)} {formatTime(row.completed_at)}</span>
          </div>
        )}
        {row.cancelled_at && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Cancelled:</span>
            <span>{formatDate(row.cancelled_at)} {formatTime(row.cancelled_at)}</span>
          </div>
        )}
        {row.cancel_reason && (
          <div className={styles.timestampRow}>
            <span className={styles.timestampLabel}>Reason:</span>
            <span>{row.cancel_reason}</span>
          </div>
        )}
      </div>
    </div>
  ),
});
