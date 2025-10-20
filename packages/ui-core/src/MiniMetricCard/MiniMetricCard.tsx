/**
 * MINI METRIC CARD - PREMIUM
 * 
 * Compact card showing single metric with trend indicator
 * Perfect for KPI dashboard
 */

'use client';

import React from 'react';
import { Card } from '../Card';
import { Icon, type IconName } from '../Icon';
import styles from './MiniMetricCard.module.css';

export interface MiniMetricCardProps {
  /** Metric label */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Trend percentage (e.g. 12.5 for +12.5%) */
  trend?: number;
  /** Trend label */
  trendLabel?: string;
  /** Icon name from icon set */
  icon?: IconName;
  /** Icon color */
  iconColor?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
  /** Action button */
  actionLabel?: string;
  onActionClick?: () => void;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function MiniMetricCard({
  label,
  value,
  trend,
  trendLabel = 'vs last month',
  icon,
  iconColor = 'theme',
  actionLabel,
  onActionClick,
  variant = 'elevated',
  className = '',
}: MiniMetricCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;
  const trendClass = trend !== undefined
    ? isPositiveTrend
      ? styles.trendPositive
      : styles.trendNegative
    : '';

  const iconColorClass = styles[`icon${iconColor.charAt(0).toUpperCase()}${iconColor.slice(1)}`];

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.labelRow}>
          {icon && (
            <div className={`${styles.iconWrapper} ${iconColorClass}`}>
              <Icon name={icon} size="lg" color={iconColor} />
            </div>
          )}
          <span className={styles.label}>{label}</span>
        </div>
        
        {actionLabel && (
          <button
            className={styles.actionButton}
            onClick={onActionClick}
            type="button"
            title={actionLabel}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 8H4M8 4V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Value */}
      <div className={styles.valueContainer}>
        <div className={styles.value}>{value}</div>
        
        {trend !== undefined && (
          <div className={`${styles.trend} ${trendClass}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={styles.trendIcon}
            >
              {isPositiveTrend ? (
                <path
                  d="M4 10L8 6L12 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span>
              {isPositiveTrend ? '+' : ''}{trend}%
            </span>
            <span className={styles.trendLabel}>{trendLabel}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
