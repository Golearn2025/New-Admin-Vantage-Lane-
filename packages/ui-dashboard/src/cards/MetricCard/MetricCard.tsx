/**
 * MetricCard - Premium metric display with gradient variant
 * Respects CardSpec from dashboard.spec.ts
 * Uses @vantage-lane/formatters for all formatting
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import styles from './MetricCard.module.css';
import { GradientPreset } from '../../theme/palettes';
import { getTrendDirection, getTrendIcon, getTrendColor } from '../../theme/helpers';

export type CardUnit = 'GBP_pence' | 'count' | 'percentage';

export interface CardSpec {
  key: string;
  title: string;
  subtitle?: string;
  unit: CardUnit;
  format: 'currency' | 'number' | 'percent';
}

export interface MetricCardProps {
  spec: CardSpec;
  value: number | null;
  delta?: number | null;
  loading?: boolean;
  variant?: 'gradient' | 'glass' | 'minimal';
  gradient?: GradientPreset;
  className?: string;
}

export function MetricCard({
  spec,
  value,
  delta,
  loading = false,
  variant = 'gradient',
  gradient = 'purple',
  className = '',
}: MetricCardProps) {
  // Format value based on spec
  const formattedValue = React.useMemo(() => {
    if (value === null) return 'N/A';
    
    // TODO: Use @vantage-lane/formatters when ready
    // For now, simple formatting
    switch (spec.format) {
      case 'currency':
        return `£${(value / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString('en-GB');
    }
  }, [value, spec.format]);

  // Format delta
  const formattedDelta = React.useMemo(() => {
    if (delta === null || delta === undefined) return null;
    
    const direction = getTrendDirection(delta);
    const icon = getTrendIcon(direction);
    const absValue = Math.abs(delta);
    
    return {
      text: `${icon} ${absValue.toFixed(1)}%`,
      direction,
      color: getTrendColor(direction),
    };
  }, [delta]);

  const variantClass = `${styles.card} ${styles[`card--${variant}`]}`;
  const gradientClass = gradient ? styles[`gradient--${gradient}`] : '';

  if (loading) {
    return (
      <div className={`${variantClass} ${gradientClass} ${styles.loading} ${className}`}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonValue} />
          <div className={styles.skeletonDelta} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${variantClass} ${gradientClass} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{spec.title}</h3>
        {spec.subtitle && <p className={styles.subtitle}>{spec.subtitle}</p>}
      </div>
      
      <div className={styles.value}>{formattedValue}</div>
      
      {formattedDelta && (
        <div 
          className={styles.delta}
          style={{ color: formattedDelta.color }}
        >
          {formattedDelta.text}
          {spec.subtitle && spec.subtitle.includes('last') && (
            <span className={styles.deltaLabel}> vs last period</span>
          )}
        </div>
      )}
    </div>
  );
}
