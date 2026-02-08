/**
 * Profile Activity Tab - Job History
 * Shows booking history for driver profiles
 * 
 * MODERN & PREMIUM Design with glass morphism
 */

'use client';

import { getCustomerBookings } from '@entities/customer/api/customerApi';
import { getDriverBookings } from '@entities/driver/api/driverApi';
import { useEffect, useMemo, useState } from 'react';
import type { UserType } from '../types';
import styles from './ProfileActivityTab.module.css';

export interface ProfileActivityTabProps {
  userId: string;
  userType: UserType;
  className?: string;
}

interface BookingSegment {
  seq_no: number;
  role: string;
  place_text: string;
  place_label: string;
}

interface BookingPricing {
  price: number;
  currency: string;
  extras_total?: number;
}

interface BookingService {
  service_code: string;
  quantity: number;
  unit_price: number;
}

interface Service {
  service_code: string;
  unit_price?: number;
}

interface Booking {
  id: string;
  reference: string;
  status: string;
  start_at: string;
  passenger_count: number;
  bag_count: number;
  trip_type: string;
  category?: string;
  flight_number?: string;
  distance_miles?: number;
  duration_min?: number;
  pricing?: BookingPricing[];
  segments?: BookingSegment[];
  services?: BookingService[];
}

export function ProfileActivityTab({ userId, userType, className }: ProfileActivityTabProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize service badges to prevent re-creation on every render
  const getServiceBadges = useMemo(() => {
    const createServiceBadges = (services: Service[]) => 
      services.map((service, idx) => {
        const isFree = (service.unit_price || 0) === 0;
        const serviceName = service.service_code.replace(/_/g, ' ');
        return (
          <span 
            key={idx} 
            className={`${styles.serviceBadge} ${isFree ? styles.serviceFree : styles.servicePaid}`}
          >
            {serviceName}
            {!isFree && (
              <span className={styles.servicePrice}> +£{service.unit_price}</span>
            )}
            {isFree && <span className={styles.freeTag}>FREE</span>}
          </span>
        );
      });
    return createServiceBadges;
  }, []);

  // Memoize booking timeline items to prevent re-creation on every render
  const bookingTimelineItems = useMemo(() => 
    bookings.map((booking) => (
      <div key={booking.id} className={styles.timelineItem}>
        <div className={styles.timelineDot} />
        <div className={styles.bookingCard}>
          <div className={styles.cardHeader}>
            <span className={styles.reference}>#{booking.reference}</span>
            <span className={`${styles.statusBadge} ${styles[`status${capitalize(booking.status)}`]}`}>
              {booking.status}
            </span>
          </div>
          
          <div className={styles.cardBody}>
            {/* Locations */}
            {getLocation(booking.segments, 'pickup') && (
              <div className={styles.detail}>
                <span className={styles.label}>📍 Pickup:</span>
                <span className={styles.value}>{getLocation(booking.segments, 'pickup')}</span>
              </div>
            )}
            {getLocation(booking.segments, 'dropoff') && (
              <div className={styles.detail}>
                <span className={styles.label}>🎯 Dropoff:</span>
                <span className={styles.value}>{getLocation(booking.segments, 'dropoff')}</span>
              </div>
            )}

            {/* Date & Time */}
            <div className={styles.detail}>
              <span className={styles.label}>📅 Date:</span>
              <span className={styles.value}>
                {new Date(booking.start_at).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {/* Price */}
            {formatPrice(booking.pricing) && (
              <div className={styles.detail}>
                <span className={styles.label}>💰 Price:</span>
                <span className={styles.value}>{formatPrice(booking.pricing)}</span>
              </div>
            )}

            {/* Flight Number */}
            {booking.flight_number && (
              <div className={styles.detail}>
                <span className={styles.label}>✈️ Flight:</span>
                <span className={styles.value}>{booking.flight_number}</span>
              </div>
            )}

          </div>

          {/* Services Section - Horizontal Badges */}
          {booking.services && booking.services.length > 0 && (
            <div className={styles.servicesSection}>
              <h4 className={styles.servicesTitle}>Services Included:</h4>
              <div className={styles.servicesBadges}>
                {getServiceBadges(booking.services)}
              </div>
            </div>
          )}
        </div>
      </div>
    )), 
    [bookings, getServiceBadges]
  );

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        let data: any[] = [];
        
        if (userType === 'driver') {
          data = await getDriverBookings(userId);
        } else if (userType === 'customer') {
          data = await getCustomerBookings(userId);
        } else {
          data = [];
        }
        
        setBookings(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId, userType]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading activity...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No booking history found</p>
      </div>
    );
  }

  const title = userType === 'driver' ? 'Job History' : 'Booking History';

  // Helper to get pickup/dropoff from segments
  const getLocation = (segments: BookingSegment[] | undefined, role: string) => {
    if (!segments || segments.length === 0) return null;
    const segment = segments.find(s => s.role === role);
    return segment?.place_label || segment?.place_text || null;
  };

  // Helper to format price
  const formatPrice = (pricing: BookingPricing[] | undefined) => {
    if (!pricing || pricing.length === 0) return null;
    const p = pricing[0];
    if (!p) return null;
    const total = (p.price || 0) + (p.extras_total || 0);
    return `${p.currency || 'GBP'} ${total.toFixed(2)}`;
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>{title}</h2>
      
      <div className={styles.timeline}>
        {bookingTimelineItems}
      </div>
    </div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
