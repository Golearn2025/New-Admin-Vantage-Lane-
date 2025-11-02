/**
 * BookingPriceBreakdown Component
 * Detailed price calculation breakdown from backend
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './BookingPriceBreakdown.module.css';

export interface PriceDetail {
  component: string;
  amount: number;
  description: string;
}

export interface PriceBreakdown {
  baseFare: number;
  distanceFee: number;
  timeFee: number;
  additionalFees: number;
  services: number;
  subtotal: number;
  multipliers: Record<string, number>;
  discounts: number;
  finalPrice: number;
}

export interface BookingPriceBreakdownProps {
  breakdown?: PriceBreakdown | undefined;
  details?: PriceDetail[] | undefined;
}

export function BookingPriceBreakdown({ breakdown, details }: BookingPriceBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!breakdown || !details) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>Complete the form to see price breakdown</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={styles.toggleLabel}>💰 Price Breakdown</span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className={styles.details}>
          {details.map((detail, index) => (
            <div key={index} className={styles.detailRow}>
              <span className={styles.detailLabel}>{detail.description}</span>
              <span className={styles.detailValue}>
                {detail.amount >= 0 ? '£' : '-£'}{Math.abs(detail.amount).toFixed(2)}
              </span>
            </div>
          ))}

          {breakdown.multipliers && Object.keys(breakdown.multipliers).length > 0 && (
            <div className={styles.surgeBadge}>
              🔥 Surge Applied: {Object.keys(breakdown.multipliers).map(key => {
                const multiplier = breakdown.multipliers?.[key] || 1;
                return `${key} (+${((multiplier - 1) * 100).toFixed(0)}%)`;
              }).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
