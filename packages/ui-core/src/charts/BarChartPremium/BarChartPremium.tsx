/**
 * BAR CHART PREMIUM - Recharts Wrapper
 * 
 * Theme-integrated bar chart with premium styling
 * Perfect for comparing values across categories
 * 
 * Features:
 * - Theme colors integration
 * - Responsive design
 * - Interactive tooltips
 * - Gradient bars
 * - Animation
 */

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../../Card';
import styles from './BarChartPremium.module.css';

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarChartPremiumProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Chart data */
  data: BarChartData[];
  /** Data keys to display as bars */
  dataKeys: Array<{
    key: string;
    name: string;
    color?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
  }>;
  /** X-axis data key */
  xAxisKey?: string;
  /** Show grid */
  showGrid?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Chart height */
  height?: number;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function BarChartPremium({
  title,
  subtitle,
  data,
  dataKeys,
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  height = 300,
  variant = 'elevated',
  className = '',
}: BarChartPremiumProps) {
  // Get theme color
  const getColor = (color?: string) => {
    // These will be read from CSS variables at runtime
    switch (color) {
      case 'success':
        return '#22c55e';
      case 'warning':
        return '#eab308';
      case 'danger':
        return '#dc2626';
      case 'info':
        return '#3b82f6';
      case 'theme':
      default:
        return 'var(--theme-primary)';
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className={styles.tooltipItem}>
              <span
                className={styles.tooltipDot}
                style={{ backgroundColor: entry.color }}
              />
              <span className={styles.tooltipName}>{entry.name}:</span>
              <span className={styles.tooltipValue}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Chart */}
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-muted)"
                opacity={0.3}
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              stroke="var(--color-text-muted)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--color-text-muted)' }}
            />
            <YAxis
              stroke="var(--color-text-muted)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--color-text-muted)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-secondary)' }} />
            {showLegend && (
              <Legend
                wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
              />
            )}
            {dataKeys.map((dataKey, index) => (
              <Bar
                key={dataKey.key}
                dataKey={dataKey.key}
                name={dataKey.name}
                fill={getColor(dataKey.color)}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
