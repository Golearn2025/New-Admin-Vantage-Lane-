/**
 * PricingBreakdownCard Component
 * 
 * Displays detailed pricing breakdown for a booking.
 * Shows base fare, distance, time, fees, services, discounts, and total.
 * 
 * Architecture: features/bookings-table/components/expanded/PricingBreakdownCard.tsx
 * Compliant: <200 lines, 100% design tokens, TypeScript strict, REUTILIZABIL
 */

'use client';

import React from 'react';
import { InfoSection } from './InfoSection';
import styles from './PricingBreakdownCard.module.css';

interface PricingBreakdownProps {
  baseFare?: number;
  distanceFee?: number;
  timeFee?: number;
  airportFees?: number;
  zoneFees?: number;
  premiumServices?: Array<{ name: string; price: number; quantity?: number }>;
  subtotal: number;
  discountAmount?: number;
  discountType?: string;
  total: number;
  currency?: string;
}

export function PricingBreakdownCard({
  baseFare,
  distanceFee,
  timeFee,
  airportFees,
  zoneFees,
  premiumServices = [],
  subtotal,
  discountAmount,
  discountType,
  total,
  currency = 'GBP',
}: PricingBreakdownProps) {
  const formatPrice = (amount: number): string => {
    const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const servicesTotal = premiumServices.reduce(
    (sum, service) => sum + service.price * (service.quantity || 1),
    0
  );

  return (
    <InfoSection title="Pricing Breakdown" icon="💰" variant="highlight">
      <div className={styles.breakdown}>
        {/* Base Pricing */}
        {baseFare !== undefined && (
          <div className={styles.row}>
            <span className={styles.label}>Base Fare:</span>
            <span className={styles.value}>{formatPrice(baseFare)}</span>
          </div>
        )}
        
        {distanceFee !== undefined && distanceFee > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Distance Fee:</span>
            <span className={styles.value}>{formatPrice(distanceFee)}</span>
          </div>
        )}
        
        {timeFee !== undefined && timeFee > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Time Fee:</span>
            <span className={styles.value}>{formatPrice(timeFee)}</span>
          </div>
        )}
        
        {airportFees !== undefined && airportFees > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Airport Fees:</span>
            <span className={styles.value}>{formatPrice(airportFees)}</span>
          </div>
        )}
        
        {zoneFees !== undefined && zoneFees > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Zone Fees:</span>
            <span className={styles.value}>{formatPrice(zoneFees)}</span>
          </div>
        )}

        {/* Premium Services */}
        {premiumServices.length > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.sectionTitle}>Premium Services:</div>
            {premiumServices.map((service, idx) => (
              <div key={idx} className={styles.row}>
                <span className={styles.labelIndent}>
                  {service.name}
                  {service.quantity && service.quantity > 1 && ` × ${service.quantity}`}
                </span>
                <span className={styles.value}>
                  {formatPrice(service.price * (service.quantity || 1))}
                </span>
              </div>
            ))}
            <div className={styles.row}>
              <span className={styles.label}>Services Total:</span>
              <span className={styles.value}>{formatPrice(servicesTotal)}</span>
            </div>
          </>
        )}

        {/* Subtotal */}
        <div className={styles.divider} />
        <div className={`${styles.row} ${styles.subtotal}`}>
          <span className={styles.label}>Subtotal:</span>
          <span className={styles.value}>{formatPrice(subtotal)}</span>
        </div>

        {/* Discount */}
        {discountAmount && discountAmount > 0 && (
          <div className={`${styles.row} ${styles.discount}`}>
            <span className={styles.label}>
              Discount {discountType && `(${discountType})`}:
            </span>
            <span className={styles.value}>-{formatPrice(discountAmount)}</span>
          </div>
        )}

        {/* Total */}
        <div className={styles.dividerBold} />
        <div className={`${styles.row} ${styles.total}`}>
          <span className={styles.label}>TOTAL:</span>
          <span className={styles.value}>{formatPrice(total)}</span>
        </div>
      </div>
    </InfoSection>
  );
}
