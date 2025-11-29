/**
 * PricingTab Component
 * 
 * Displays detailed pricing breakdown:
 * - Calculation steps
 * - Surge multipliers
 * - Commission splits
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import React, { useMemo } from 'react';
import { Calculator, Flame, Coins } from 'lucide-react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { InfoSection } from './InfoSection';
import { formatCurrency, formatPercentage } from '@/shared/utils/formatters';
import styles from './PricingTab.module.css';

interface PricingTabProps {
  booking: BookingListItem;
}

export function PricingTab({ booking }: PricingTabProps) {
  const basePrice = booking.base_price || 0;
  const totalPrice = booking.fare_amount || 0;
  const platformFee = booking.platform_fee || 0;
  const operatorNet = booking.operator_net || 0;
  const driverPayout = booking.driver_payout || 0;

  // Memoize paid services items to prevent re-creation on every render
  const paidServiceItems = useMemo(() => 
    booking.paid_services.map((service, idx) => (
      <div key={idx} className={styles.calcRow}>
        <span className={styles.calcLabel}>
          {idx + 4}. {service.service_code}:
        </span>
        <span className={styles.calcValue}>
          {formatCurrency(service.unit_price * service.quantity)}
        </span>
      </div>
    )), 
    [booking.paid_services]
  );

  // Calculate surge if applicable
  const hasSurge = booking.platform_commission_pct && booking.platform_commission_pct > 10;
  const surgeMultiplier = hasSurge ? (booking.platform_commission_pct || 0) / 10 : 1;
  const surgeAmount = hasSurge ? totalPrice - basePrice : 0;

  return (
    <div className={styles.container}>
      {/* Calculation Breakdown */}
      <InfoSection title="Calculation" icon={<Calculator size={18} />} variant="compact">
        <div className={styles.calculation}>
          <div className={styles.calcRow}>
            <span className={styles.calcLabel}>1. Base fare:</span>
            <span className={styles.calcValue}>{formatCurrency(basePrice)}</span>
          </div>

          {booking.distance_miles && (
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>
                2. Distance ({booking.distance_miles?.toFixed(1) || 0} mi):
              </span>
              <span className={styles.calcValue}>
                {formatCurrency((booking.distance_miles || 0) * 2.8)}
              </span>
            </div>
          )}

          {booking.duration_min && (
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>
                3. Time ({booking.duration_min} min):
              </span>
              <span className={styles.calcValue}>
                {formatCurrency((booking.duration_min || 0) * 0.45)}
              </span>
            </div>
          )}

          {booking.paid_services.length > 0 && (
            <>
              {paidServiceItems}
            </>
          )}

          <div className={styles.calcDivider} />

          <div className={styles.calcRow}>
            <span className={styles.calcLabelBold}>Subtotal:</span>
            <span className={styles.calcValueBold}>{formatCurrency(basePrice)}</span>
          </div>
        </div>
      </InfoSection>

      {/* Surge Multipliers */}
      {hasSurge && (
        <InfoSection title="Surge Multipliers" icon={<Flame size={18} />} variant="compact">
          <div className={styles.surge}>
            <div className={styles.surgeRow}>
              <span className={styles.surgeLabel}>
                Active multiplier:
              </span>
              <span className={styles.surgeMultiplier}>
                ⚡ {surgeMultiplier?.toFixed(1) || 0}x
              </span>
            </div>

            <div className={styles.surgeRow}>
              <span className={styles.surgeLabel}>Surge amount:</span>
              <span className={styles.surgeAmount}>+{formatCurrency(surgeAmount)}</span>
            </div>

            <div className={styles.surgeDivider} />

            <div className={styles.surgeRow}>
              <span className={styles.surgeLabelBold}>Total with surge:</span>
              <span className={styles.surgeValueBold}>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </InfoSection>
      )}

      {/* Commission Split */}
      <InfoSection title="Commission Split" icon={<Coins size={18} />} variant="compact">
        <div className={styles.commission}>
          <div className={styles.commissionRow}>
            <span className={styles.commissionLabel}>Platform Fee:</span>
            <span className={styles.commissionValue}>
              {formatCurrency(platformFee)}
              {booking.platform_commission_pct && (
                <span className={styles.commissionPct}>
                  ({formatPercentage(booking.platform_commission_pct, 0)})
                </span>
              )}
            </span>
          </div>

          <div className={styles.commissionRow}>
            <span className={styles.commissionLabel}>Operator Net:</span>
            <span className={styles.commissionValue}>
              {formatCurrency(operatorNet)}
            </span>
          </div>

          <div className={styles.commissionRow}>
            <span className={styles.commissionLabel}>Driver Payout:</span>
            <span className={styles.commissionValueHighlight}>
              {formatCurrency(driverPayout)}
              {booking.driver_commission_pct && (
                <span className={styles.commissionPct}>
                  ({formatPercentage(booking.driver_commission_pct, 0)})
                </span>
              )}
            </span>
          </div>

          <div className={styles.commissionDivider} />

          <div className={styles.commissionRow}>
            <span className={styles.commissionLabelBold}>Total:</span>
            <span className={styles.commissionValueBold}>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </InfoSection>

      {/* Payment Info */}
      <div className={styles.paymentInfo}>
        <div className={styles.paymentRow}>
          <span className={styles.paymentLabel}>Payment Method:</span>
          <span className={styles.paymentValue}>{booking.payment_method}</span>
        </div>
        <div className={styles.paymentRow}>
          <span className={styles.paymentLabel}>Payment Status:</span>
          <span className={styles.paymentValue}>{booking.payment_status}</span>
        </div>
        <div className={styles.paymentRow}>
          <span className={styles.paymentLabel}>Currency:</span>
          <span className={styles.paymentValue}>{booking.currency}</span>
        </div>
      </div>
    </div>
  );
}
