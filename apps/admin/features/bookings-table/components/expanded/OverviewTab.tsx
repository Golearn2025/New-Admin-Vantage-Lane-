/**
 * OverviewTab Component
 * 
 * Displays booking overview with:
 * - Pickup/Dropoff locations with copy/maps actions
 * - Customer information
 * - Services (FREE + PAID)
 * - Special notes
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import React from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { InfoSection } from './InfoSection';
import styles from './OverviewTab.module.css';

interface OverviewTabProps {
  booking: BookingListItem;
}

export function OverviewTab({ booking }: OverviewTabProps) {
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // TODO: Show toast notification
  };

  const handleOpenMaps = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  const freeServices = booking.free_services || [];
  const paidServices = booking.paid_services || [];

  return (
    <div className={styles.container}>
      {/* Pickup Section */}
      <InfoSection title="Pickup" icon="📍" variant="compact">
        <div className={styles.locationCard}>
          <div className={styles.address}>{booking.pickup_location}</div>
          
          <div className={styles.locationMeta}>
            {booking.scheduled_at && (
              <span className={styles.metaItem}>
                🕐 {new Date(booking.scheduled_at).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
            {booking.flight_number && (
              <span className={styles.metaItem}>
                ✈️ {booking.flight_number}
              </span>
            )}
          </div>

          <div className={styles.locationActions}>
            <button
              className={styles.actionButton}
              onClick={() => handleCopyAddress(booking.pickup_location)}
              type="button"
            >
              📋 Copy Address
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleOpenMaps(booking.pickup_location)}
              type="button"
            >
              🗺️ Open in Maps
            </button>
          </div>
        </div>
      </InfoSection>

      {/* Drop-off Section */}
      <InfoSection title="Drop-off" icon="📍" variant="compact">
        <div className={styles.locationCard}>
          <div className={styles.address}>{booking.destination}</div>

          <div className={styles.locationActions}>
            <button
              className={styles.actionButton}
              onClick={() => handleCopyAddress(booking.destination)}
              type="button"
            >
              📋 Copy Address
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleOpenMaps(booking.destination)}
              type="button"
            >
              🗺️ Open in Maps
            </button>
          </div>
        </div>
      </InfoSection>

      {/* Customer Section */}
      <InfoSection title="Customer" icon="👤" variant="compact">
        <div className={styles.customerCard}>
          <div className={styles.customerRow}>
            <span className={styles.customerName}>{booking.customer_name}</span>
            {booking.customer_loyalty_tier && (
              <span className={styles.loyaltyBadge}>
                ⭐ {booking.customer_loyalty_tier.toUpperCase()}
              </span>
            )}
          </div>

          <div className={styles.customerDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📞</span>
              <span className={styles.detailText}>{booking.customer_phone}</span>
            </div>
            {booking.customer_email && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📧</span>
                <span className={styles.detailText}>{booking.customer_email}</span>
              </div>
            )}
            {booking.customer_total_bookings > 0 && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>🎫</span>
                <span className={styles.detailText}>
                  {booking.customer_total_bookings} bookings
                </span>
              </div>
            )}
          </div>
        </div>
      </InfoSection>

      {/* Services Section */}
      {(freeServices.length > 0 || paidServices.length > 0) && (
        <InfoSection title="Services" icon="✨" variant="compact">
          <div className={styles.servicesCard}>
            {freeServices.length > 0 && (
              <div className={styles.serviceGroup}>
                <div className={styles.serviceGroupTitle}>FREE</div>
                <div className={styles.serviceList}>
                  {freeServices.map((service, idx) => (
                    <span key={idx} className={styles.serviceItem}>
                      ✅ {service.service_code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {paidServices.length > 0 && (
              <div className={styles.serviceGroup}>
                <div className={styles.serviceGroupTitle}>PAID</div>
                <div className={styles.serviceList}>
                  {paidServices.map((service, idx) => (
                    <span key={idx} className={styles.serviceItemPaid}>
                      💰 {service.service_code} (+£{service.unit_price.toFixed(2)})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoSection>
      )}

      {/* Notes Section */}
      {booking.notes && (
        <InfoSection title="Notes" icon="📝" variant="compact">
          <div className={styles.notesCard}>
            <p className={styles.notesText}>{booking.notes}</p>
          </div>
        </InfoSection>
      )}
    </div>
  );
}
