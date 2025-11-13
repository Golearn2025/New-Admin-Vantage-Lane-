'use client';

/**
 * ReturnBookingLayout Component
 * 
 * Special layout for RETURN bookings showing 2 legs + pricing breakdown.
 * 
 * Architecture: features/bookings-table/components/expanded/ReturnBookingLayout.tsx
 * Compliant: <200 lines, 100% design tokens, TypeScript strict, REUTILIZABIL
 */

import { XCircle, CheckCircle, RefreshCw, Sparkles, Hourglass } from 'lucide-react';

import React from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { useBookingLegs } from '../../hooks/useBookingLegs';
import { BookingLegCard } from './BookingLegCard';
import { PricingBreakdownCard } from './PricingBreakdownCard';
import { CommissionSplitsCard } from './CommissionSplitsCard';
import { InfoSection } from './InfoSection';
import styles from './ReturnBookingLayout.module.css';

interface ReturnBookingLayoutProps {
  booking: BookingListItem;
  freeServices?: Array<{ service_code: string; notes?: string | null }>;
  premiumServices?: Array<{ name: string; price: number; quantity?: number }>;
}

export function ReturnBookingLayout({
  booking,
  freeServices = [],
  premiumServices = [],
}: ReturnBookingLayoutProps) {
  const { legs, loading, error } = useBookingLegs(booking.id);

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingIcon}><Hourglass size={18} strokeWidth={2} /></span>
        <span className={styles.loadingText}>Loading legs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}><XCircle size={18} strokeWidth={2} /></span>
        <span className={styles.errorText}>Failed to load legs: {error.message}</span>
      </div>
    );
  }

  // Calculate pricing (from booking.fare_amount and booking.base_price)
  const totalPrice = booking.fare_amount; // Already in pounds
  const basePrice = booking.base_price; // Already in pounds
  const servicesTotal = premiumServices.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);
  
  // For RETURN: 10% discount
  const discountRate = 0.10;
  const subtotal = basePrice + servicesTotal;
  const discountAmount = subtotal * discountRate;

  return (
    <div className={styles.container}>
      {/* TOP: Pricing + Commission (2 columns) */}
      <div className={styles.twoColumnGrid}>
        <PricingBreakdownCard
          baseFare={basePrice / 2} // Split between 2 legs
          premiumServices={premiumServices}
          subtotal={subtotal}
          discountAmount={discountAmount}
          discountType="Return 10%"
          total={totalPrice}
          currency="GBP"
        />
        
        <CommissionSplitsCard
          totalPaid={totalPrice}
          platformFee={totalPrice * 0.10}
          platformRate={0.10}
          operatorNet={totalPrice * 0.90}
          operatorRate={0.10}
          driverEarnings={totalPrice * 0.90 * 0.80}
          currency="GBP"
        />
      </div>

      {/* MIDDLE: Legs (full-width) */}
      <div className={styles.legsSection}>
        <h3 className={styles.legsTitle}>🔄 Return Journey Legs</h3>
        {legs.length > 0 ? (
          legs.map((leg) => (
            <BookingLegCard
              key={leg.id}
              leg={leg}
              onAssignDriver={(id) => console.log('Assign driver to leg:', id)}
              onChangeDriver={(id) => console.log('Change driver for leg:', id)}
              onNotifyDriver={(id) => console.log('Notify driver for leg:', id)}
              onCancelLeg={(id) => console.log('Cancel leg:', id)}
            />
          ))
        ) : (
          <div className={styles.noLegs}>
            <span className={styles.noLegsIcon}>⚠️</span>
            <span className={styles.noLegsText}>
              No legs found. Legs will be created automatically when booking is confirmed.
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM: Services (if any) */}
      {freeServices.length > 0 && (
        <InfoSection title="Included Services" icon="✨" variant="compact">
          <div className={styles.servicesList}>
            {freeServices.map((service, idx) => (
              <span key={idx} className={styles.serviceItem}>
                ✅ {service.service_code}
                {service.notes && ` (${service.notes})`}
              </span>
            ))}
          </div>
        </InfoSection>
      )}
    </div>
  );
}
