/**
 * CommissionSplitsCard Component
 * 
 * Displays commission splits breakdown for a booking.
 * Shows platform fee, operator commission, and driver earnings.
 * 
 * Architecture: features/bookings-table/components/expanded/CommissionSplitsCard.tsx
 * Compliant: <200 lines, 100% design tokens, TypeScript strict, REUTILIZABIL
 */

'use client';

import React from 'react';
import { InfoSection } from './InfoSection';
import styles from './CommissionSplitsCard.module.css';

interface CommissionSplitsProps {
  totalPaid: number;
  platformFee: number;
  platformRate?: number;
  operatorNet: number;
  operatorRate?: number;
  driverEarnings: number;
  currency?: string;
}

export function CommissionSplitsCard({
  totalPaid,
  platformFee,
  platformRate,
  operatorNet,
  operatorRate,
  driverEarnings,
  currency = 'GBP',
}: CommissionSplitsProps) {
  const formatPrice = (amount: number): string => {
    const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatRate = (rate: number): string => {
    return `${(rate * 100).toFixed(0)}%`;
  };

  return (
    <InfoSection title="Commission Splits" icon="💵" variant="highlight">
      <div className={styles.splits}>
        {/* Total Paid */}
        <div className={`${styles.row} ${styles.total}`}>
          <span className={styles.label}>Client Paid:</span>
          <span className={styles.value}>{formatPrice(totalPaid)}</span>
        </div>

        <div className={styles.divider} />

        {/* Platform Fee */}
        <div className={styles.row}>
          <span className={styles.label}>
            Platform Fee {platformRate && `(${formatRate(platformRate)})`}:
          </span>
          <span className={`${styles.value} ${styles.platform}`}>
            {formatPrice(platformFee)}
          </span>
        </div>

        {/* Operator Commission */}
        <div className={styles.row}>
          <span className={styles.label}>
            Operator Commission {operatorRate && `(${formatRate(operatorRate)})`}:
          </span>
          <span className={`${styles.value} ${styles.operator}`}>
            {formatPrice(operatorNet - driverEarnings)}
          </span>
        </div>

        {/* Driver Earnings */}
        <div className={`${styles.row} ${styles.driver}`}>
          <span className={styles.label}>Driver Earnings:</span>
          <span className={styles.value}>{formatPrice(driverEarnings)}</span>
        </div>

        {/* Visual Breakdown */}
        <div className={styles.visualBreakdown}>
          <div
            className={styles.platformBar}
            style={{ width: `${(platformFee / totalPaid) * 100}%` }}
            title={`Platform: ${formatPrice(platformFee)}`}
          />
          <div
            className={styles.operatorBar}
            style={{ width: `${((operatorNet - driverEarnings) / totalPaid) * 100}%` }}
            title={`Operator: ${formatPrice(operatorNet - driverEarnings)}`}
          />
          <div
            className={styles.driverBar}
            style={{ width: `${(driverEarnings / totalPaid) * 100}%` }}
            title={`Driver: ${formatPrice(driverEarnings)}`}
          />
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.platformDot}`} />
            <span className={styles.legendLabel}>Platform</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.operatorDot}`} />
            <span className={styles.legendLabel}>Operator</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.driverDot}`} />
            <span className={styles.legendLabel}>Driver</span>
          </div>
        </div>
      </div>
    </InfoSection>
  );
}
