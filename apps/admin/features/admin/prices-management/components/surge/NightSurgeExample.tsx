import React from 'react';
import type { PricingConfig } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function NightSurgeExample({ config }: Props) {
  return (
    <div className={styles.exampleBox}>
      <h3 className={styles.exampleTitle}>Example: Night Surge (22:00-06:00)</h3>
      <div className={styles.exampleRow}>
        <span className={styles.exampleLabel}>Base Trip Cost:</span>
        <span className={styles.exampleValue}>£100.00</span>
      </div>
      <div className={styles.exampleRow}>
        <span className={styles.exampleLabel}>Night Multiplier:</span>
        <span className={styles.exampleValue}>
          {config.time_multipliers.night?.value || 1}x (+
          {(((config.time_multipliers.night?.value || 1) - 1) * 100).toFixed(0)}%)
        </span>
      </div>
      <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
        <span className={styles.exampleLabel}>Total:</span>
        <span className={styles.exampleValue}>
          £{(100 * (config.time_multipliers.night?.value || 1)).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
