/**
 * Booking Expanded Row Component
 * 
 * Shows complete booking details when row is expanded
 * Compliant: <200 lines (UI component)
 * Refactored: All inline styles moved to CSS module
 */

import React from 'react';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import { StatusBadge } from '@vantage-lane/ui-core';
import type { BookingStatus } from '@vantage-lane/ui-core';
import { BookingInfoCard } from './BookingInfoCard';
import { calculateFleetTotal } from '../helpers';
import styles from './BookingExpandedRow.module.css';

interface BookingExpandedRowProps {
  booking: BookingListItem;
}

export function BookingExpandedRow({ booking }: BookingExpandedRowProps) {
  // NO BUSINESS LOGIC HERE - Pure UI component
  const fleetTotal = calculateFleetTotal(booking);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          Booking Details - {booking.reference}
        </h3>
        <StatusBadge
          status={booking.status as BookingStatus}
          isUrgent={booking.is_urgent}
          isNew={booking.is_new}
          showIcon={true}
          size="lg"
        />
      </div>

      {/* Grid Layout - 3 columns */}
      <div className={styles.grid}>
        {/* Customer Info */}
        <BookingInfoCard icon="👤" title="Customer">
          <div className={styles.infoText}>{booking.customer_name}</div>
          <div className={styles.secondaryText}>{booking.customer_phone}</div>
          {booking.customer_total_bookings > 0 && (
            <div className={styles.statsText}>
              📊 {booking.customer_total_bookings} total bookings
            </div>
          )}
        </BookingInfoCard>

        {/* Trip Details */}
        <BookingInfoCard icon="🚗" title="Trip Info">
          <div><strong>Type:</strong> {booking.trip_type}</div>
          <div><strong>Category:</strong> {booking.category}</div>
          {booking.distance_miles && <div><strong>Distance:</strong> {Math.round(booking.distance_miles)} miles</div>}
          {booking.duration_min && <div><strong>Duration:</strong> {Math.floor(booking.duration_min / 60)}h {booking.duration_min % 60}m</div>}
          {booking.hours && <div><strong>Hours:</strong> {booking.hours}h rental</div>}
          {fleetTotal > 0 && <div><strong>Fleet:</strong> {fleetTotal} vehicles</div>}
        </BookingInfoCard>

        {/* Pricing */}
        <BookingInfoCard icon="💰" title="Pricing">
          <div className={styles.priceAmount}>
            £{(booking.fare_amount / 100).toFixed(2)}
          </div>
          <div className={styles.priceLabel}>Total fare (incl. extras)</div>
        </BookingInfoCard>
      </div>

      {/* Route Section */}
      <div className={styles.routeSection}>
        <h4 className={styles.routeTitle}>
          📍 Route
        </h4>
        <div className={styles.routeContent}>
          <div className={styles.routeColumn}>
            <div className={styles.pickupCard}>
              <div className={styles.pickupLabel}>
                PICKUP
              </div>
              <div className={styles.locationName}>
                {booking.pickup_location}
              </div>
            </div>
          </div>
          <div className={styles.routeArrow}>→</div>
          <div className={styles.routeColumn}>
            <div className={styles.dropoffCard}>
              <div className={styles.dropoffLabel}>
                DROPOFF
              </div>
              <div className={styles.locationName}>
                {booking.destination}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.buttonSecondary}>
          👁️ View Full Details
        </button>
        {!booking.driver_id && (
          <button className={styles.buttonPrimary}>
            🚗 Assign Driver
          </button>
        )}
      </div>
    </div>
  );
}
