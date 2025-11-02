/**
 * AssignmentTab Component
 * 
 * Displays driver and vehicle assignment status for a booking.
 * Shows different UI based on assignment status:
 * - Unassigned: Quick assign + WhatsApp share
 * - Assigned: Driver/Vehicle details + actions
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import { Car, CheckCircle, Clock, Plane, User, UserCheck, RefreshCw, Hourglass } from 'lucide-react';
import React from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { InfoSection } from './InfoSection';
import styles from './AssignmentTab.module.css';

interface AssignmentTabProps {
  booking: BookingListItem;
  onAssign?: () => void;
  onReassign?: () => void;
  onContact?: () => void;
  onShareWhatsApp?: () => void;
}

export function AssignmentTab({
  booking,
  onAssign,
  onReassign,
  onContact,
  onShareWhatsApp,
}: AssignmentTabProps) {
  const isAssigned = Boolean(booking.driver_id);

  // Unassigned state
  if (!isAssigned) {
    return (
      <div className={styles.container}>
        <div className={styles.unassignedState}>
          <div className={styles.statusIcon}><Hourglass size={18} strokeWidth={2} /></div>
          <h3 className={styles.statusTitle}>Waiting for Driver Assignment</h3>
          <p className={styles.statusDescription}>
            No driver has been assigned to this booking yet.
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={onAssign}
              type="button"
            >
              <span className={styles.buttonIcon}><UserCheck size={18} strokeWidth={2} /></span>
              Assign Driver
            </button>

            <button
              className={styles.secondaryButton}
              onClick={onShareWhatsApp}
              type="button"
            >
              <span className={styles.buttonIcon}>📱</span>
              Share to WhatsApp
            </button>
          </div>

          <div className={styles.broadcastInfo}>
            <span className={styles.infoIcon}>📢</span>
            <span className={styles.infoText}>
              Broadcast this job to operators via WhatsApp
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Assigned state
  return (
    <div className={styles.container}>
      <div className={styles.assignedBanner}>
        ✅ Assigned to {booking.driver_name}
      </div>

      <div className={styles.grid}>
        {/* Driver Info */}
        <InfoSection title="Driver" icon="👨‍✈️" variant="compact">
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{booking.driver_name}</span>
            </div>

            {booking.driver_rating && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Rating:</span>
                <span className={styles.value}>
                  ⭐ {booking.driver_rating.toFixed(1)}/5
                </span>
              </div>
            )}

            {booking.driver_phone && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{booking.driver_phone}</span>
              </div>
            )}

            {booking.driver_email && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.valueSmall}>{booking.driver_email}</span>
              </div>
            )}
          </div>
        </InfoSection>

        {/* Vehicle Info */}
        <InfoSection title="Vehicle" icon="🚗" variant="compact">
          <div className={styles.details}>
            {booking.vehicle_make && booking.vehicle_model_name && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Model:</span>
                <span className={styles.value}>
                  {booking.vehicle_make} {booking.vehicle_model_name}
                </span>
              </div>
            )}

            {booking.vehicle_plate && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Plate:</span>
                <span className={styles.value}>{booking.vehicle_plate}</span>
              </div>
            )}

            {booking.vehicle_color && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Color:</span>
                <span className={styles.value}>{booking.vehicle_color}</span>
              </div>
            )}

            {booking.vehicle_year && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Year:</span>
                <span className={styles.value}>{booking.vehicle_year}</span>
              </div>
            )}
          </div>
        </InfoSection>
      </div>

      {/* Assignment Meta */}
      {booking.assigned_at && (
        <div className={styles.meta}>
          🕐 {new Date(booking.assigned_at).toLocaleString('en-GB')}
          {booking.assigned_by_name && ` • 👤 ${booking.assigned_by_name}`}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.secondaryButton}
          onClick={onReassign}
          type="button"
        >
          <span className={styles.buttonIcon}><RefreshCw size={18} strokeWidth={2} /></span>
          Reassign Driver
        </button>

        <button
          className={styles.secondaryButton}
          onClick={onContact}
          type="button"
        >
          <span className={styles.buttonIcon}>📞</span>
          Contact Driver
        </button>

        <button
          className={styles.secondaryButton}
          onClick={onShareWhatsApp}
          type="button"
        >
          <span className={styles.buttonIcon}>📱</span>
          Share Full Details
        </button>
      </div>
    </div>
  );
}
