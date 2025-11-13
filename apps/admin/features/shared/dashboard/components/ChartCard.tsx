/**
 * ChartCard Component
 * 
 * Wrapper for dashboard charts with lazy loading support.
 * 100% presentational - receives chart as ReactNode slot.
 * 
 * Ver 2.4 - PAS 3
 */

'use client';

import { type ReactNode } from 'react';
import styles from './ChartCard.module.css';

export interface ChartCardProps {
  /** Card title */
  title: string;
  /** Chart component (passed as ReactNode slot) */
  children: ReactNode;
  /** Optional period selector */
  periodSelector?: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Optional footer content */
  footer?: ReactNode;
}

export function ChartCard({
  title,
  children,
  periodSelector,
  loading = false,
  footer,
}: ChartCardProps) {
  return (
    <div className={`${styles.card} ${loading ? styles.loading : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {periodSelector && (
          <div className={styles.periodSelector}>{periodSelector}</div>
        )}
      </div>

      {/* Chart Content */}
      <div className={styles.chartWrapper}>
        {loading ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonChart} />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer (optional) */}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
