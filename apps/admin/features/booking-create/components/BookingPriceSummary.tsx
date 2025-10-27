/**
 * BookingPriceSummary Component
 * Price breakdown with real-time calculation
 */

import styles from './BookingPriceSummary.module.css';

export interface BookingPriceSummaryProps {
  basePrice: number;
  servicesTotal: number;
  total: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function BookingPriceSummary({
  basePrice,
  servicesTotal,
  total,
  isSubmitting,
  onSubmit,
}: BookingPriceSummaryProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Price Summary</h3>
      
      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span className={styles.label}>Base Price:</span>
          <span className={styles.value}>£{basePrice.toFixed(2)}</span>
        </div>
        
        {servicesTotal > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Services:</span>
            <span className={styles.value}>£{servicesTotal.toFixed(2)}</span>
          </div>
        )}
        
        <div className={styles.divider} />
        
        <div className={styles.total}>
          <span className={styles.totalLabel}>Total:</span>
          <span className={styles.totalValue}>£{total.toFixed(2)}</span>
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
            <span className={styles.spinner}>⏳</span>
            Creating...
          </>
        ) : (
          <>
            <span className={styles.icon}>🚀</span>
            Create Booking
          </>
        )}
      </button>
    </div>
  );
}
