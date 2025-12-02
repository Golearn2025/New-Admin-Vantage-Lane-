import { Hourglass, Percent, Rocket } from 'lucide-react';
import { useState } from 'react';
/**
 * BookingPriceSummary Component
 * Price breakdown with real-time calculation
 */

import { formatCurrency } from '@/shared/utils/formatters';
import styles from './BookingPriceSummary.module.css';
import { BookingPriceBreakdown } from './BookingPriceBreakdown';
import type { PriceDetail, PriceBreakdown } from './BookingPriceBreakdown';

export interface BookingPriceSummaryProps {
  basePrice: number;
  servicesTotal: number;
  total: number;
  isSubmitting: boolean;
  isPriceLoading?: boolean | undefined;
  breakdown?: PriceBreakdown | undefined;
  details?: PriceDetail[] | undefined;
  onSubmit: () => void;
}

export function BookingPriceSummary({
  basePrice,
  servicesTotal,
  total,
  isSubmitting,
  isPriceLoading = false,
  breakdown,
  details,
  onSubmit,
}: BookingPriceSummaryProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  const discountAmount = (basePrice + servicesTotal) * (discountPercent / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Price Summary {isPriceLoading && <span className={styles.spinner}>⏳</span>}</h3>
      
      {/* Detailed Breakdown */}
      <BookingPriceBreakdown breakdown={breakdown} details={details} />
      
      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span className={styles.label}>Base Price:</span>
          <span className={styles.value}>{formatCurrency(basePrice)}</span>
        </div>
        
        {servicesTotal > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Services:</span>
            <span className={styles.value}>{formatCurrency(servicesTotal)}</span>
          </div>
        )}
        
        {/* Discount Field */}
        <div className={styles.discountRow}>
          <label className={styles.discountLabel}>
            <Percent size={16} />
            Discount %:
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
            className={styles.discountInput}
            placeholder="0"
          />
        </div>
        
        {discountAmount > 0 && (
          <div className={styles.row}>
            <span className={styles.discountText}>Discount ({discountPercent}%):</span>
            <span className={styles.discountValue}>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        
        <div className={styles.divider} />
        
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalValue}>{formatCurrency(finalTotal)}</span>
        </div>
      </div>
      
      <button
        type="button"
        className={styles.submitButton}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner}><Hourglass size={18} strokeWidth={2} /></span>
            Creating...
          </>
        ) : (
          <>
            <span className={styles.icon}><Rocket size={16} /></span>
            Create Booking
          </>
        )}
      </button>
    </div>
  );
}
