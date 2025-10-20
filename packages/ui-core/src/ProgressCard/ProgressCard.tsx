/**
 * PROGRESS CARD - PREMIUM
 * 
 * Card with multiple progress bars
 * Perfect for showing completion status, goals, or metrics
 * 
 * Features:
 * - Animated progress bars
 * - Theme-colored bars
 * - Percentage display
 * - Gradient fills
 */

'use client';

import React from 'react';
import { Card } from '../Card';
import styles from './ProgressCard.module.css';

export interface ProgressItem {
  label: string;
  value: number;
  max?: number;
  color?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
  showPercentage?: boolean;
}

export interface ProgressCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Array of progress items */
  items: ProgressItem[];
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function ProgressCard({
  title,
  subtitle,
  items,
  variant = 'elevated',
  className = '',
}: ProgressCardProps) {
  function getProgressColor(color?: ProgressItem['color']) {
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
  }

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {/* Progress Items */}
      <div className={styles.progressList}>
        {items.map((item, index) => {
          const max = item.max || 100;
          const percentage = Math.min((item.value / max) * 100, 100);
          const barColor = getProgressColor(item.color);
          const showPercent = item.showPercentage !== false;

          return (
            <div key={index} className={styles.progressItem}>
              {/* Label Row */}
              <div className={styles.labelRow}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.value}>
                  {item.value}
                  {showPercent && (
                    <span className={styles.percentage}>
                      {' '}({percentage.toFixed(0)}%)
                    </span>
                  )}
                </span>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 0 12px ${barColor}40`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
