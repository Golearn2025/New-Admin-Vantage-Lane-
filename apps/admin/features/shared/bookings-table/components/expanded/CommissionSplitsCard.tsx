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

import React, { useEffect, useRef } from 'react';
import { Coins } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/shared/utils/formatters';
import styles from './CommissionSplitsCard.module.css';
import { InfoSection } from './InfoSection';

interface CommissionSplitsProps {
  totalPaid: number;
  platformFee: number;
  platformRate?: number | undefined;
  operatorNet: number;
  operatorRate?: number | undefined;
  driverEarnings: number;
  currency?: string | undefined;
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
  const breakdownRef = useRef<HTMLDivElement>(null);

  // Use centralized formatters

  // Set CSS custom properties for bar widths
  useEffect(() => {
    if (breakdownRef.current && totalPaid > 0) {
      const platformWidth = (platformFee / totalPaid) * 100;
      const operatorWidth = ((operatorNet - driverEarnings) / totalPaid) * 100;
      const driverWidth = (driverEarnings / totalPaid) * 100;

      breakdownRef.current.style.setProperty('--platform-width', `${platformWidth}%`);
      breakdownRef.current.style.setProperty('--operator-width', `${operatorWidth}%`);
      breakdownRef.current.style.setProperty('--driver-width', `${driverWidth}%`);
    }
  }, [totalPaid, platformFee, operatorNet, driverEarnings]);

  return (
    <InfoSection title="Commission Splits" icon={<Coins size={18} />} variant="highlight">
      <div className={styles.splits}>
        {/* Total Paid */}
        <div className={`${styles.row} ${styles.total}`}>
          <span className={styles.label}>Client Paid:</span>
          <span className={styles.value}>{formatCurrency(totalPaid)}</span>
        </div>

        <div className={styles.divider} />

        {/* Platform Fee */}
        <div className={styles.row}>
          <span className={styles.label}>
            Platform Fee {platformRate && `(${formatPercentage(platformRate * 100, 0)})`}:
          </span>
          <span className={`${styles.value} ${styles.platform}`}>{formatCurrency(platformFee)}</span>
        </div>

        {/* Operator Commission */}
        <div className={styles.row}>
          <span className={styles.label}>
            Operator Commission {operatorRate && `(${formatPercentage(operatorRate * 100, 0)})`}:
          </span>
          <span className={`${styles.value} ${styles.operator}`}>
            {formatCurrency(operatorNet - driverEarnings)}
          </span>
        </div>

        {/* Driver Earnings */}
        <div className={`${styles.row} ${styles.driver}`}>
          <span className={styles.label}>Driver Earnings:</span>
          <span className={styles.value}>{formatCurrency(driverEarnings)}</span>
        </div>

        {/* Visual Breakdown */}
        <div ref={breakdownRef} className={styles.visualBreakdown}>
          <div
            className={styles.platformBar}
            title={`Platform: ${formatCurrency(platformFee)}`}
          />
          <div
            className={styles.operatorBar}
            title={`Operator: ${formatCurrency(operatorNet - driverEarnings)}`}
          />
          <div
            className={styles.driverBar}
            title={`Driver: ${formatCurrency(driverEarnings)}`}
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
