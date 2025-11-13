/**
 * BookingLegCard Component - PREMIUM EDITION
 * 
 * Displays a single booking leg using REUTILIZABLE InfoSection.
 * Shows route, driver, vehicle, status, and pricing.
 * 
 * Architecture: features/bookings-table/components/expanded/BookingLegCard.tsx
 * Compliant: <200 lines, 100% design tokens, TypeScript strict, REUTILIZABIL
 */

'use client';

import React from 'react';
import { Hourglass, User, Car, MapPin, RefreshCw, CheckCircle, XCircle, Circle, Star, AlertTriangle, DollarSign, Banknote, Clock } from 'lucide-react';
import { Button } from '@vantage-lane/ui-core';
import type { BookingLegWithDetails } from '@entities/booking-leg';
import { InfoSection } from './InfoSection';
import styles from './BookingLegCard.module.css';

interface BookingLegCardProps {
  leg: BookingLegWithDetails;
  onAssignDriver?: (legId: string) => void;
  onChangeDriver?: (legId: string) => void;
  onNotifyDriver?: (legId: string) => void;
  onCancelLeg?: (legId: string) => void;
}

export function BookingLegCard({
  leg,
  onAssignDriver,
  onChangeDriver,
  onNotifyDriver,
  onCancelLeg,
}: BookingLegCardProps) {
  const getStatusIcon = (status: string): React.ReactNode => {
    const size = 14;
    const icons: Record<string, React.ReactNode> = {
      pending: <Hourglass size={size} strokeWidth={2} />,
      assigned: <User size={size} strokeWidth={2} />,
      en_route: <Car size={size} strokeWidth={2} />,
      arrived: <MapPin size={size} strokeWidth={2} />,
      in_progress: <RefreshCw size={size} strokeWidth={2} />,
      completed: <CheckCircle size={size} strokeWidth={2} />,
      cancelled: <XCircle size={size} strokeWidth={2} />,
    };
    return icons[status] || <Hourglass size={size} strokeWidth={2} />;
  };

  const getLegIcon = (type: string): React.ReactNode => {
    const size = 12;
    const icons: Record<string, React.ReactNode> = {
      outbound: <Circle size={size} fill="var(--color-leg-outbound)" stroke="var(--color-leg-outbound)" />,
      return: <Circle size={size} fill="var(--color-leg-return)" stroke="var(--color-leg-return)" />,
      fleet_vehicle: <Car size={size} strokeWidth={2} />,
    };
    return icons[type] || <Circle size={size} fill="var(--color-leg-outbound)" stroke="var(--color-leg-outbound)" />;
  };

  const legIcon = getLegIcon(leg.leg_type);
  const statusIcon = getStatusIcon(leg.status);
  const legLabel = leg.leg_type === 'outbound' ? 'OUTBOUND' : 
                   leg.leg_type === 'return' ? 'RETURN' : 'FLEET';

  const actions = (
    <div className={styles.headerActions}>
      <span className={styles.statusBadge}>
        {statusIcon} {leg.status.toUpperCase()}
      </span>
    </div>
  );

  return (
    <InfoSection
      title={`LEG ${leg.leg_number}: ${legLabel} (${leg.driver_reference})`}
      icon={legIcon}
      variant="bordered"
      actions={actions}
    >
      {/* Route */}
      <div className={styles.section}>
        <div className={styles.routeBlock}>
          <div className={styles.locationCard}>
            <div className={styles.locationLabel}>🟢 PICKUP</div>
            <div className={styles.locationText}>{leg.pickup_location}</div>
          </div>
          <div className={styles.routeArrow}>
            ↓ {leg.distance_miles?.toFixed(2)} mi • {leg.duration_min} min
          </div>
          <div className={styles.locationCard}>
            <div className={styles.locationLabel}>🔴 DROPOFF</div>
            <div className={styles.locationText}>{leg.destination}</div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className={styles.dataRow}>
        <span className={styles.label}>📅 Scheduled:</span>
        <span className={styles.value}>
          {new Date(leg.scheduled_at).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>

      {/* Driver & Vehicle */}
      {leg.assigned_driver_id ? (
        <div className={styles.assignment}>
          <div className={styles.dataRow}>
            <span className={styles.label}><User size={14} /> Driver:</span>
            <span className={styles.value}>
              {leg.driver_name} {leg.driver_rating && (<>(<Star size={14} /> {leg.driver_rating.toFixed(1)})</>)}
              {leg.driver_phone && ` • ${leg.driver_phone}`}
            </span>
          </div>
          <div className={styles.dataRow}>
            <span className={styles.label}><Car size={14} /> Vehicle:</span>
            <span className={styles.value}>
              {leg.vehicle_make} {leg.vehicle_model_name}
              {leg.vehicle_plate && ` • ${leg.vehicle_plate} • ${leg.vehicle_color}`}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.unassigned}>
          <span className={styles.unassignedIcon}><AlertTriangle size={16} /></span>
          <span className={styles.unassignedText}>No driver assigned</span>
        </div>
      )}

      {/* Pricing */}
      <div className={styles.pricing}>
        <div className={styles.dataRow}>
          <span className={styles.label}><DollarSign size={14} /> Price:</span>
          <span className={styles.value}>£{leg.leg_price.toFixed(2)}</span>
        </div>
        {leg.driver_payout && (
          <div className={styles.dataRow}>
            <span className={styles.label}><Banknote size={14} /> Payout:</span>
            <span className={styles.value}>
              £{leg.driver_payout.toFixed(2)} •{' '}
              {leg.payout_status === 'paid' ? (<><CheckCircle size={14} /> Paid</>) : (<><Clock size={14} /> Pending</>)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {leg.status !== 'completed' && leg.status !== 'cancelled' && (
        <div className={styles.actions}>
          {!leg.assigned_driver_id && onAssignDriver && (
            <Button variant="primary" size="sm" onClick={() => onAssignDriver(leg.id)}>
              Assign Driver
            </Button>
          )}
          {leg.assigned_driver_id && onChangeDriver && (
            <Button variant="secondary" size="sm" onClick={() => onChangeDriver(leg.id)}>
              Change Driver
            </Button>
          )}
          {leg.assigned_driver_id && onNotifyDriver && (
            <Button variant="secondary" size="sm" onClick={() => onNotifyDriver(leg.id)}>
              🔔 Notify
            </Button>
          )}
          {onCancelLeg && (
            <Button variant="danger" size="sm" onClick={() => onCancelLeg(leg.id)}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </InfoSection>
  );
}
