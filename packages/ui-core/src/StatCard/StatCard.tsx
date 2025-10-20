/**
 * STAT CARD - PREMIUM
 * 
 * Large stat display with mini trend chart
 * Perfect for highlighting key metrics with visual trend
 * 
 * Features:
 * - Large value display
 * - Mini SVG trend chart
 * - Trend indicator (up/down)
 * - Theme integration
 */

'use client';

import React from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import styles from './StatCard.module.css';

export interface StatCardProps {
  /** Stat label */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Trend percentage */
  trend?: number;
  /** Trend label */
  trendLabel?: string;
  /** Data points for mini chart (optional) */
  chartData?: number[];
  /** Chart color */
  chartColor?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel = 'vs last period',
  chartData = [],
  chartColor = 'theme',
  variant = 'elevated',
  className = '',
}: StatCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;
  const hasChart = chartData.length > 0;

  // Generate SVG path for mini chart
  const generateChartPath = () => {
    if (!hasChart) return '';

    const width = 100;
    const height = 40;
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min || 1;

    const points = chartData.map((val, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const chartPath = generateChartPath();

  function getChartColor() {
    switch (chartColor) {
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

  const color = getChartColor();

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Label */}
      <div className={styles.label}>{label}</div>

      {/* Value */}
      <div className={styles.value}>{value}</div>

      {/* Trend and Chart Row */}
      <div className={styles.footer}>
        {/* Trend */}
        {trend !== undefined && (
          <div
            className={`${styles.trend} ${
              isPositiveTrend ? styles.trendPositive : styles.trendNegative
            }`}
          >
            <Icon
              name={isPositiveTrend ? 'arrow-up' : 'arrow-down'}
              size="xs"
            />
            <span>
              {isPositiveTrend ? '+' : ''}
              {trend}%
            </span>
            <span className={styles.trendLabel}>{trendLabel}</span>
          </div>
        )}

        {/* Mini Chart */}
        {hasChart && (
          <div className={styles.chartContainer}>
            <svg
              width="100"
              height="40"
              viewBox="0 0 100 40"
              className={styles.chart}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`gradient-${label}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d={`${chartPath} L 100,40 L 0,40 Z`}
                fill={`url(#gradient-${label})`}
                className={styles.chartArea}
              />
              {/* Line stroke */}
              <path
                d={chartPath}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.chartLine}
              />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
}
