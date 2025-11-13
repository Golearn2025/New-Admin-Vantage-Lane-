import React from 'react';
import { BarChart3, Banknote } from 'lucide-react';
import type { VehicleTypeRates } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  title?: string;
  rates: VehicleTypeRates;
  distanceMiles?: number; // default 15.5
  durationMinutes?: number; // default 45
}

export function VehicleExampleCard({ title = 'Example Calculation', rates, distanceMiles = 15.5, durationMinutes = 45 }: Props) {
  const calculate = (r: VehicleTypeRates) => {
    const distance = distanceMiles;
    const duration = durationMinutes;
    const first6 = Math.min(distance, 6) * r.per_mile_first_6;
    const remaining = Math.max(distance - 6, 0) * r.per_mile_after_6;
    const distanceFee = first6 + remaining;
    const timeFee = duration * r.per_minute;
    const total = r.base_fare + distanceFee + timeFee;
    return {
      baseFare: r.base_fare,
      distanceFee,
      timeFee,
      total: Math.max(total, r.minimum_fare),
    };
  };

  const example = calculate(rates);
  const platformCommission = 0.10; // 10%
  const operatorCommission = 0.20; // 20%

  const customerPrice = example.total;
  const platformFee = customerPrice * platformCommission;
  const operatorNet = customerPrice - platformFee;
  const operatorCommissionAmount = operatorNet * operatorCommission;
  const driverPayout = operatorNet - operatorCommissionAmount;

  return (
    <div className={styles.exampleBox}>
      <h3 className={styles.exampleTitle}>{title} - {distanceMiles} miles, {durationMinutes} min</h3>
      <div className={styles.exampleSection}>
        <h4 className={styles.exampleSubtitle}>
          <div className={styles.flexRow}>
            <Banknote className="h-4 w-4" />
            Customer Pays:
          </div>
        </h4>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Fare:</span>
          <span className={styles.exampleValue}>£{example.baseFare.toFixed(2)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Distance Fee:</span>
          <span className={styles.exampleValue}>£{example.distanceFee.toFixed(2)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Time Fee:</span>
          <span className={styles.exampleValue}>£{example.timeFee.toFixed(2)}</span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Customer Total:</span>
          <span className={styles.exampleValue}>£{customerPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.exampleSection}>
        <h4 className={styles.exampleSubtitle}>
          <div className={styles.flexRow}>
            <BarChart3 className="h-4 w-4" />
            Commission Breakdown:
          </div>
        </h4>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Platform Fee (10%):</span>
          <span className={`${styles.exampleValue} ${styles.textPrimary}`}>£{platformFee.toFixed(2)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Operator Net:</span>
          <span className={styles.exampleValue}>£{operatorNet.toFixed(2)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Operator Commission (20%):</span>
          <span className={`${styles.exampleValue} ${styles.textSuccess}`}>£{operatorCommissionAmount.toFixed(2)}</span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Driver Payout (80%):</span>
          <span className={`${styles.exampleValue} ${styles.textInfo}`}>£{driverPayout.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
