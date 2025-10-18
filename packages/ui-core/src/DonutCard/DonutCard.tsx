/**
 * DONUT CARD - PREMIUM
 * 
 * Card with pure CSS donut chart and legend
 * Perfect for showing data distribution
 * 
 * Features:
 * - Pure CSS donut chart (no dependencies)
 * - Animated segments
 * - Interactive legend
 * - Theme-colored segments
 */

'use client';

import React, { useState } from 'react';
import { Card } from '../Card';
import styles from './DonutCard.module.css';

export interface DonutSegment {
  label: string;
  value: number;
  color?: 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink';
}

export interface DonutCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Array of segments */
  segments: DonutSegment[];
  /** Center label (optional) */
  centerLabel?: string;
  /** Center value (optional) */
  centerValue?: string | number;
  /** Show percentage in legend */
  showPercentage?: boolean;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function DonutCard({
  title,
  subtitle,
  segments,
  centerLabel,
  centerValue,
  showPercentage = true,
  variant = 'elevated',
  className = '',
}: DonutCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate total
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  // Calculate percentages
  const segmentsWithPercent = segments.map(seg => ({
    ...seg,
    percentage: total > 0 ? (seg.value / total) * 100 : 0,
  }));

  // Generate conic gradient for donut
  let currentPercent = 0;
  const gradientStops = segmentsWithPercent.map((seg, index) => {
    const startPercent = currentPercent;
    currentPercent += seg.percentage;
    const color = getSegmentColor(seg.color);
    const opacity = hoveredIndex === null || hoveredIndex === index ? 1 : 0.3;
    return `${color} ${startPercent}% ${currentPercent}%`;
  }).join(', ');

  const conicGradient = `conic-gradient(${gradientStops})`;

  function getSegmentColor(color?: DonutSegment['color']) {
    switch (color) {
      case 'success':
        return 'var(--color-success-500)';
      case 'warning':
        return 'var(--color-warning-500)';
      case 'danger':
        return 'var(--color-danger-default)';
      case 'info':
        return 'var(--color-info-500)';
      case 'purple':
        return '#a855f7';
      case 'pink':
        return '#ec4899';
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

      {/* Content */}
      <div className={styles.content}>
        {/* Donut Chart */}
        <div className={styles.chartContainer}>
          <div
            className={styles.donut}
            style={{ background: conicGradient }}
          >
            {/* Center hole */}
            <div className={styles.donutCenter}>
              {centerLabel && (
                <div className={styles.centerLabel}>{centerLabel}</div>
              )}
              {centerValue !== undefined && (
                <div className={styles.centerValue}>{centerValue}</div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {segmentsWithPercent.map((segment, index) => (
            <div
              key={index}
              className={`${styles.legendItem} ${
                hoveredIndex === index ? styles.legendItemActive : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={styles.legendColor}
                style={{ backgroundColor: getSegmentColor(segment.color) }}
              />
              <div className={styles.legendContent}>
                <div className={styles.legendLabel}>{segment.label}</div>
                <div className={styles.legendValue}>
                  {segment.value}
                  {showPercentage && (
                    <span className={styles.legendPercent}>
                      {' '}({segment.percentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
