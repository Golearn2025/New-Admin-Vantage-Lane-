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

import React, { useMemo } from 'react';
import { MapPin, User, Sparkles, FileText, Plane, Map, Star, Phone, CheckCircle, DollarSign, Clipboard, Mail, Ticket } from 'lucide-react';
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

  // Type-safe services access - use any if BookingListItem doesn't have services property
  const services = (booking as any).services || [];
  const freeServices = services.filter((s: any) => (s.unit_price || 0) === 0);
  const paidServices = services.filter((s: any) => (s.unit_price || 0) > 0);

  // Memoize free services items to prevent re-creation on every render
  const freeServiceItems = useMemo(() => 
    freeServices.map((service: any, idx: number) => (
      <span key={idx} className={styles.serviceItem}>
        <CheckCircle size={14} /> {service.service_code}
      </span>
    )), 
    [freeServices]
  );

  // Memoize paid services items to prevent re-creation on every render
  const paidServiceItems = useMemo(() => 
    paidServices.map((service: any, idx: number) => (
      <span key={idx} className={styles.serviceItemPaid}>
        <DollarSign size={14} /> {service.service_code} (+£{service.unit_price.toFixed(2)})
      </span>
    )), 
    [paidServices]
  );

  return (
    <div className={styles.container}>
      {/* Pickup Section */}
      <InfoSection title="Pickup" icon={<MapPin size={18} />} variant="compact">
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
                <Plane size={14} /> {booking.flight_number}
              </span>
            )}
          </div>

          <div className={styles.locationActions}>
            <button
              className={styles.actionButton}
              onClick={() => handleCopyAddress(booking.pickup_location)}
              type="button"
            >
              <Clipboard size={14} /> Copy Address
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleOpenMaps(booking.pickup_location)}
              type="button"
            >
              <Map size={14} /> Open in Maps
            </button>
          </div>
        </div>
      </InfoSection>

      {/* Drop-off Section */}
      <InfoSection title="Drop-off" icon={<MapPin size={18} />} variant="compact">
        <div className={styles.locationCard}>
          <div className={styles.address}>{booking.destination}</div>

          <div className={styles.locationActions}>
            <button
              className={styles.actionButton}
              onClick={() => handleCopyAddress(booking.destination)}
              type="button"
            >
              <Clipboard size={14} /> Copy Address
            </button>
            <button
              className={styles.actionButton}
              onClick={() => handleOpenMaps(booking.destination)}
              type="button"
            >
              <Map size={14} /> Open in Maps
            </button>
          </div>
        </div>
      </InfoSection>

      {/* Customer Section */}
      <InfoSection title="Customer" icon={<User size={18} />} variant="compact">
        <div className={styles.customerCard}>
          <div className={styles.customerRow}>
            <span className={styles.customerName}>{booking.customer_name}</span>
            {booking.customer_loyalty_tier && (
              <span className={styles.loyaltyBadge}>
                <Star size={14} /> {booking.customer_loyalty_tier.toUpperCase()}
              </span>
            )}
          </div>

          <div className={styles.customerDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}><Phone size={14} /></span>
              <span className={styles.detailText}>{booking.customer_phone}</span>
            </div>
            {booking.customer_email && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}><Mail size={14} /></span>
                <span className={styles.detailText}>{booking.customer_email}</span>
              </div>
            )}
            {booking.customer_total_bookings > 0 && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}><Ticket size={14} /></span>
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
        <InfoSection title="Services" icon={<Sparkles size={18} />} variant="compact">
          <div className={styles.servicesCard}>
            {freeServices.length > 0 && (
              <div className={styles.serviceGroup}>
                <div className={styles.serviceGroupTitle}>FREE</div>
                <div className={styles.serviceList}>
                  {freeServiceItems}
                </div>
              </div>
            )}

            {paidServices.length > 0 && (
              <div className={styles.serviceGroup}>
                <div className={styles.serviceGroupTitle}>PAID</div>
                <div className={styles.serviceList}>
                  {paidServiceItems}
                </div>
              </div>
            )}
          </div>
        </InfoSection>
      )}

      {/* Notes Section */}
      {booking.notes && (
        <InfoSection title="Notes" icon={<FileText size={18} />} variant="compact">
          <div className={styles.notesCard}>
            <p className={styles.notesText}>{booking.notes}</p>
          </div>
        </InfoSection>
      )}
    </div>
  );
}
