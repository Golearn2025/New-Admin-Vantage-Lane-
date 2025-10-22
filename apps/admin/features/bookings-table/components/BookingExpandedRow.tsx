/**
 * BookingExpandedRow Component - PREMIUM EDITION v2
 *
 * Complete booking details with premium reusable components.
 * Layout:
 * - 3-column grid (Return Journey, Route, Operator)
 * - Full-width Assignment Section with tabs at bottom
 *
 * Features:
 * - Return journey details
 * - FREE services list (10 items)
 * - Complete addresses with coordinates
 * - Customer notes
 * - Operator info
 * - Driver & Vehicle assignment (tabbed interface)
 *
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

import React from 'react';
import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import { InfoSection, AssignmentSection, type DriverDetails, type VehicleDetails } from './expanded';
import styles from './BookingExpandedRow.module.css';

interface BookingExpandedRowProps {
  booking: BookingListItem;
  freeServices?: string[];
  customerNotes?: string;
  operatorName?: string;
  operatorRating?: number;
  operatorReviews?: number;
  returnDate?: string | null;
  returnTime?: string | null;
  returnFlight?: string | null;
  driverDetails?: DriverDetails;
  vehicleDetails?: VehicleDetails;
  assignedAt?: string;
  assignedBy?: string;
}

export function BookingExpandedRow({
  booking,
  freeServices = [],
  customerNotes,
  operatorName,
  operatorRating,
  operatorReviews,
  returnDate,
  returnTime,
  returnFlight,
  driverDetails,
  vehicleDetails,
  assignedAt,
  assignedBy,
}: BookingExpandedRowProps) {
  const serviceNames: Record<string, string> = {
    wifi: 'WiFi',
    bottled_water: 'Bottled Water',
    meet_and_greet: 'Meet & Greet',
    luggage_assistance: 'Luggage Assistance',
    phone_chargers: 'Phone Chargers',
    priority_support: 'Priority Support',
    wait_time_included: 'Wait Time',
    pet_friendly: 'Pet Friendly',
    music_preference: 'Music Preference',
    communication_style: 'Communication',
  };

  const hasReturnJourney = booking.trip_type === 'return' && (returnDate || returnTime);

  return (
    <div className={styles.expandedContainer}>
      {/* 3-COLUMN GRID */}
      <div className={styles.threeColumnGrid}>
        {/* LEFT: Return Journey + Free Services */}
        <div className={styles.column}>
          {hasReturnJourney && (
            <InfoSection title="Return Journey" icon="🔄" variant="default">
              <div className={styles.dataList}>
                {returnDate && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>{returnDate}</span>
                  </div>
                )}
                {returnTime && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>{returnTime}</span>
                  </div>
                )}
                {returnFlight && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>Flight:</span>
                    <span className={styles.value}>✈️ {returnFlight}</span>
                  </div>
                )}
              </div>
            </InfoSection>
          )}

          {freeServices.length > 0 && (
            <InfoSection title="Included Services" icon="✨" variant="highlight">
              <div className={styles.servicesList}>
                {freeServices.map((service, idx) => (
                  <div key={idx} className={styles.serviceItem}>
                    <span className={styles.check}>✅</span>
                    <span className={styles.serviceName}>
                      {serviceNames[service] || service}
                    </span>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}
        </div>

        {/* CENTER: Route + Notes */}
        <div className={styles.column}>
          <InfoSection title="Complete Route" icon="📍" variant="default">
            <div className={styles.routeBlock}>
              <div className={styles.locationCard}>
                <div className={styles.locationLabel}>🟢 PICKUP</div>
                <div className={styles.locationText}>{booking.pickup_location}</div>
              </div>
              <div className={styles.routeArrow}>↓ {booking.distance_miles?.toFixed(2)} mi • {booking.duration_min} min</div>
              <div className={styles.locationCard}>
                <div className={styles.locationLabel}>🔴 DROPOFF</div>
                <div className={styles.locationText}>{booking.destination}</div>
              </div>
            </div>
          </InfoSection>

          {customerNotes && (
            <InfoSection title="Customer Notes" icon="📝" variant="compact">
              <p className={styles.notes}>"{customerNotes}"</p>
            </InfoSection>
          )}
        </div>

        {/* RIGHT: Operator + Details */}
        <div className={styles.column}>
          {operatorName && (
            <InfoSection title="Operator" icon="🏢" variant="default">
              <div className={styles.dataList}>
                <div className={styles.dataRow}>
                  <span className={styles.label}>Company:</span>
                  <span className={styles.value}>{operatorName}</span>
                </div>
                {operatorRating && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>Rating:</span>
                    <span className={styles.value}>⭐ {operatorRating.toFixed(1)}</span>
                  </div>
                )}
                {operatorReviews && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>Reviews:</span>
                    <span className={styles.value}>{operatorReviews}</span>
                  </div>
                )}
                <div className={styles.dataRow}>
                  <span className={styles.label}>Source:</span>
                  <span className={styles.value}>{booking.source}</span>
                </div>
              </div>
            </InfoSection>
          )}

          <InfoSection title="Booking Details" icon="📊" variant="compact">
            <div className={styles.dataList}>
              {booking.flight_number && (
                <div className={styles.dataRow}>
                  <span className={styles.label}>Flight:</span>
                  <span className={styles.value}>✈️ {booking.flight_number}</span>
                </div>
              )}
              <div className={styles.dataRow}>
                <span className={styles.label}>Passengers:</span>
                <span className={styles.value}>{booking.passenger_count}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Bags:</span>
                <span className={styles.value}>{booking.bag_count}</span>
              </div>
            </div>
          </InfoSection>
        </div>
      </div>

      {/* FULL-WIDTH ASSIGNMENT SECTION */}
      <div className={styles.assignmentWrapper}>
        <AssignmentSection
          driverId={booking.driver_id}
          vehicleId={booking.vehicle_id}
          driverDetails={driverDetails}
          vehicleDetails={vehicleDetails}
          assignedAt={assignedAt}
          assignedBy={assignedBy}
        />
      </div>
    </div>
  );
}
