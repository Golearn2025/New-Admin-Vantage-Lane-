/**
 * VehicleTypeCalculationExample Component
 * 
 * Example calculation display with commission breakdown - focused on calculation display
 */

'use client';

import React from 'react';
import { BarChart3, Banknote } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatters';
import type { VehicleTypeRates } from '@entities/pricing';
import { calculateExample, calculateCommissionBreakdown } from '../utils/vehicleCalculations';
import styles from './PricesManagementPage.module.css';

interface VehicleTypeCalculationExampleProps {
  vehicleTypes: Record<string, VehicleTypeRates>;
}

export function VehicleTypeCalculationExample({ 
  vehicleTypes 
}: VehicleTypeCalculationExampleProps) {
  
  // Only show if executive type exists
  if (!vehicleTypes.executive) {
    return null;
  }

  const example = calculateExample(vehicleTypes.executive);
  const breakdown = calculateCommissionBreakdown(example.total);

  return (
    <div className={styles.exampleBox}>
      <h3 className={styles.exampleTitle}>
        Example Calculation (Executive) - 15.5 miles, 45 min
      </h3>
      
      <div className={styles.exampleSection}>
        <h4 className={styles.exampleSubtitle}>
          <div className={styles.flexRow}>
            <Banknote className="h-4 w-4" />
            Customer Pays:
          </div>
        </h4>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Fare:</span>
          <span className={styles.exampleValue}>{formatCurrency(example.baseFare)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Distance Fee:</span>
          <span className={styles.exampleValue}>{formatCurrency(example.distanceFee)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Time Fee:</span>
          <span className={styles.exampleValue}>{formatCurrency(example.timeFee)}</span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Customer Total:</span>
          <span className={styles.exampleValue}>{formatCurrency(breakdown.customerPrice)}</span>
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
          <span className={`${styles.exampleValue} ${styles.textPrimary}`}>
            {formatCurrency(breakdown.platformFee)}
          </span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Operator Net:</span>
          <span className={styles.exampleValue}>{formatCurrency(breakdown.operatorNet)}</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Operator Commission (20%):</span>
          <span className={`${styles.exampleValue} ${styles.textSuccess}`}>
            {formatCurrency(breakdown.operatorCommissionAmount)}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Driver Payout (80%):</span>
          <span className={`${styles.exampleValue} ${styles.textInfo}`}>
            {formatCurrency(breakdown.driverPayout)}
          </span>
        </div>
      </div>
    </div>
  );
}
