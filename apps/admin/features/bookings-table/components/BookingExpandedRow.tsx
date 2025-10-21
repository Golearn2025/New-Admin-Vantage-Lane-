/**
 * BookingExpandedRow Component - PREMIUM EDITION
 *
 * Complete booking details with all data fields
 * Features:
 * - Return journey details
 * - FREE services list
 * - Complete addresses
 * - Customer notes
 * - Operator info
 * - Assignment status
 * - 2-column premium layout
 *
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

import React from 'react';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import styles from './BookingExpandedRow.module.css';

interface BookingExpandedRowProps {
  booking: BookingListItem;
  freeServices?: string[];  // e.g. ['wifi', 'water', 'meet_greet']
  customerNotes?: string;
  operatorName?: string;
  returnDate?: string | null;
  returnTime?: string | null;
  returnFlight?: string | null;
}

export function BookingExpandedRow({
  booking,
  freeServices = [],
  customerNotes,
  operatorName,
  returnDate,
  returnTime,
  returnFlight,
}: BookingExpandedRowProps) {
  // Format FREE services display names
  const serviceNames: Record<string, string> = {
    wifi: 'WiFi',
    water: 'Bottled Water',
    meet_greet: 'Meet and Greet',
    luggage_assist: 'Luggage Assistance',
    phone_charger: 'Phone Chargers',
    priority_support: 'Priority Support',
    wait_time: 'Wait Time Included',
    pet_friendly: 'Pet Friendly',
    music_pref: 'Music Preference',
    communication: 'Communication Style',
  };

  const hasReturnJourney = booking.trip_type === 'return' && (returnDate || returnTime);

  return (
    <div className={styles.expandedContainer}>
      {/* 2-COLUMN LAYOUT */}
      <div className={styles.twoColumnGrid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          {/* RETURN JOURNEY (if applicable) */}
          {hasReturnJourney && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>🔄 Return Journey</h4>
              <div className={styles.sectionContent}>
                {returnDate && (
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Return Date:</span>
                    <span className={styles.dataValue}>{returnDate}</span>
                  </div>
                )}
                {returnTime && (
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Return Time:</span>
                    <span className={styles.dataValue}>{returnTime}</span>
                  </div>
                )}
                {returnFlight && (
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Return Flight:</span>
                    <span className={styles.dataValue}>✈️ {returnFlight}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FREE SERVICES */}
          {freeServices.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>✨ Included Services (Free)</h4>
              <div className={styles.servicesList}>
                {freeServices.map((service, idx) => (
                  <div key={idx} className={styles.serviceItem}>
                    <span className={styles.serviceCheck}>✅</span>
                    <span className={styles.serviceName}>
                      {serviceNames[service] || service}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOMER NOTES */}
          {customerNotes && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>📝 Customer Notes</h4>
              <div className={styles.notesContent}>
                <p className={styles.notesText}>"{customerNotes}"</p>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          {/* ASSIGNMENT STATUS */}
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>🚗 Assignment Status</h4>
            <div className={styles.sectionContent}>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Driver:</span>
                <span className={booking.driver_name ? styles.dataValue : styles.dataValueEmpty}>
                  {booking.driver_name || '❌ Not assigned'}
                </span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Vehicle:</span>
                <span className={booking.vehicle_id ? styles.dataValue : styles.dataValueEmpty}>
                  {booking.vehicle_id ? '✅ Assigned' : '❌ Not assigned'}
                </span>
              </div>
            </div>
          </section>

          {/* OPERATOR INFO */}
          {operatorName && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>🏢 Operator</h4>
              <div className={styles.sectionContent}>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Company:</span>
                  <span className={styles.dataValue}>{operatorName}</span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>Source:</span>
                  <span className={styles.dataValue}>{booking.source}</span>
                </div>
              </div>
            </section>
          )}

          {/* COMPLETE ADDRESSES */}
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>📍 Complete Addresses</h4>
            <div className={styles.addressesContent}>
              <div className={styles.addressBlock}>
                <div className={styles.addressLabel}>🟢 Pickup:</div>
                <div className={styles.addressText}>{booking.pickup_location}</div>
              </div>
              <div className={styles.addressBlock}>
                <div className={styles.addressLabel}>🔴 Dropoff:</div>
                <div className={styles.addressText}>{booking.destination}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
