/**
 * METRIC BARS CARD - PREMIUM
 * 
 * Compact card with mini vertical bars for quick metrics overview
 * Perfect for dashboard KPIs
 * 
 * Features:
 * - Theme-colored bars
 * - Animated bars on mount
 * - Hover tooltips
 * - Responsive design
 */

'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import styles from './MetricBarsCard.module.css';

export interface MetricBar {
  label: string;
  value: number;
  max?: number;
  color?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
}

export interface MetricBarsCardProps {
  /** Card title */
  title: string;
  /** Card subtitle/description */
  subtitle?: string;
  /** Array of metric bars to display */
  metrics: MetricBar[];
  /** Total value (optional, shown at bottom) */
  totalLabel?: string;
  totalValue?: string | number;
  /** Action button */
  actionLabel?: string;
  onActionClick?: () => void;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function MetricBarsCard({
  title,
  subtitle,
  metrics,
  totalLabel,
  totalValue,
  actionLabel,
  onActionClick,
  variant = 'elevated',
  className = '',
}: MetricBarsCardProps) {
  // Calculate max value for bar heights
  const maxValue = Math.max(
    ...metrics.map(m => m.max || m.value)
  );

  const getBarColor = (color?: MetricBar['color']) => {
    switch (color) {
      case 'success':
        return 'var(--color-success-500)';
      case 'warning':
        return 'var(--color-warning-500)';
      case 'danger':
        return 'var(--color-danger-default)';
      case 'info':
        return 'var(--color-info-500)';
      case 'theme':
      default:
        return 'var(--theme-primary)';
    }
  };

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {/* Bars Container */}
      <div className={styles.barsContainer}>
        {metrics.map((metric, index) => {
          const heightPercent = (metric.value / maxValue) * 100;
          const barColor = getBarColor(metric.color);

          return (
            <div key={index} className={styles.barWrapper}>
              {/* Bar */}
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 -2px 8px ${barColor}40`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                  title={`${metric.label}: ${metric.value}`}
                />
              </div>

              {/* Label */}
              <div className={styles.barLabel}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {(totalValue !== undefined || actionLabel) && (
        <div className={styles.footer}>
          {totalValue !== undefined && (
            <div className={styles.total}>
              {totalLabel && (
                <span className={styles.totalLabel}>{totalLabel}</span>
              )}
              <span className={styles.totalValue}>{totalValue}</span>
            </div>
          )}

          {actionLabel && (
            <button
              className={styles.actionButton}
              onClick={onActionClick}
              type="button"
            >
              {actionLabel}
              <ArrowRight size={16} strokeWidth={2} className={styles.actionIcon} />
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
