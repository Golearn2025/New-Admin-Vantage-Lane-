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

import { Car, CheckCircle, Clock, Plane, User, UserCheck, RefreshCw, Hourglass, Smartphone, Radio, Star } from 'lucide-react';
import React from 'react';
import { Button } from '@vantage-lane/ui-core';
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
            <Button variant="primary" size="sm" onClick={onAssign} leftIcon={<UserCheck size={16} />}>
              Assign Driver
            </Button>
            <Button variant="secondary" size="sm" onClick={onShareWhatsApp} leftIcon={<Smartphone size={16} />}>
              Share to WhatsApp
            </Button>
          </div>

          <div className={styles.broadcastInfo}>
            <Radio size={18} />
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
        <span className={styles.bannerText}>
          <CheckCircle size={16} /> Assigned to {booking.driver_name}
        </span>
      </div>

      <div className={styles.grid}>
        {/* Driver Info */}
        <InfoSection title="Driver" icon={<User size={18} />} variant="compact">
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{booking.driver_name}</span>
            </div>

            {booking.driver_rating && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Rating:</span>
                <span className={styles.value}>
                  <Star size={14} /> {booking.driver_rating.toFixed(1)}/5
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
        <InfoSection title="Vehicle" icon={<Car size={18} />} variant="compact">
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
          <Clock size={14} /> {new Date(booking.assigned_at).toLocaleString('en-GB')}
          {booking.assigned_by_name && (<> • <User size={14} /> {booking.assigned_by_name}</>)}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" onClick={onReassign} leftIcon={<RefreshCw size={16} />}>
          Reassign Driver
        </Button>
        <Button variant="secondary" size="sm" onClick={onContact} leftIcon={<Clock size={16} />}>
          Contact Driver
        </Button>
        <Button variant="secondary" size="sm" onClick={onShareWhatsApp} leftIcon={<Smartphone size={16} />}>
          Share Full Details
        </Button>
      </div>
    </div>
  );
}
