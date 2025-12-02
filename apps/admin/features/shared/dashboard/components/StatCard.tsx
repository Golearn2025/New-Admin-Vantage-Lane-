/**
 * StatCard Component
 * 
 * Presentational stat card for dashboard metrics.
 * 100% presentational - no logic, no state, no side effects.
 * Icons from lucide-react only.
 * 
 * Ver 2.4 - PAS 3
 */

'use client';
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/shared/utils/formatters';
import styles from './StatCard.module.css';

export interface StatCardProps {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Delta percentage (e.g., +12.5, -3.2) */
  delta?: number;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  delta,
  trend = 'neutral',
  loading = false,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${loading ? styles.loading : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Icon */}
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} size={24} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        {loading ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonValue} />
            {subtitle && <div className={styles.skeletonSubtitle} />}
          </div>
        ) : (
          <>
            <div className={styles.value}>{value}</div>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </>
        )}
      </div>

      {/* Trend Badge */}
      {!loading && delta !== undefined && (
        <div className={`${styles.trendBadge} ${styles[trend]}`}>
          <span className={styles.deltaValue}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
