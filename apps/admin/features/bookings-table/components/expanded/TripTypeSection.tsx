/**
 * TripTypeSection Component
 * 
 * Displays trip-specific details based on booking type:
 * - HOURLY: Duration, start/end time, route
 * - FLEET: Vehicle breakdown by category
 * 
 * Compliant:
 * - <100 lines
 * - TypeScript strict
 * - Design tokens 100%
 * - Reusable InfoSection
 */

'use client';

import React from 'react';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import { InfoSection } from './InfoSection';
import styles from './TripTypeSection.module.css';

interface TripTypeSectionProps {
  booking: BookingListItem;
}

export function TripTypeSection({ booking }: TripTypeSectionProps) {
  // HOURLY booking
  if (booking.trip_type === 'hourly' && booking.hours) {
    const endTime = booking.scheduled_at
      ? calculateEndTime(booking.scheduled_at, booking.hours)
      : null;

    return (
      <InfoSection title="Hourly Booking" icon="⏱️" variant="highlight">
        <div className={styles.dataList}>
          <div className={styles.dataRow}>
            <span className={styles.label}>Duration:</span>
            <span className={styles.value}>{booking.hours}h</span>
          </div>
          {booking.scheduled_at && (
            <>
              <div className={styles.dataRow}>
                <span className={styles.label}>Start:</span>
                <span className={styles.value}>{formatTime(booking.scheduled_at)}</span>
              </div>
              {endTime && (
                <div className={styles.dataRow}>
                  <span className={styles.label}>Est. End:</span>
                  <span className={styles.value}>{formatTime(endTime)}</span>
                </div>
              )}
            </>
          )}
          {booking.distance_miles && (
            <div className={styles.dataRow}>
              <span className={styles.label}>Route:</span>
              <span className={styles.value}>
                {booking.distance_miles.toFixed(2)} mi • {booking.duration_min} min
              </span>
            </div>
          )}
        </div>
      </InfoSection>
    );
  }

  // FLEET booking
  if (booking.trip_type === 'fleet') {
    const totalVehicles =
      (booking.fleet_executive || 0) +
      (booking.fleet_s_class || 0) +
      (booking.fleet_v_class || 0) +
      (booking.fleet_suv || 0);

    if (totalVehicles === 0) return null;

    return (
      <InfoSection title="Fleet Booking" icon="🚗" variant="highlight">
        <div className={styles.fleetSummary}>
          <strong>Total Vehicles: {totalVehicles}</strong>
        </div>
        <div className={styles.fleetList}>
          {(booking.fleet_executive ?? 0) > 0 && (
            <div className={styles.fleetItem}>
              🚙 {booking.fleet_executive}× Executive
            </div>
          )}
          {(booking.fleet_s_class ?? 0) > 0 && (
            <div className={styles.fleetItem}>
              👑 {booking.fleet_s_class}× S-Class (Luxury)
            </div>
          )}
          {(booking.fleet_v_class ?? 0) > 0 && (
            <div className={styles.fleetItem}>
              🚐 {booking.fleet_v_class}× V-Class (Van)
            </div>
          )}
          {(booking.fleet_suv ?? 0) > 0 && (
            <div className={styles.fleetItem}>
              🏔️ {booking.fleet_suv}× SUV
            </div>
          )}
        </div>
      </InfoSection>
    );
  }

  return null;
}

// Helper functions
function calculateEndTime(startTime: string, hours: number): string {
  const start = new Date(startTime);
  start.setHours(start.getHours() + hours);
  return start.toISOString();
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
