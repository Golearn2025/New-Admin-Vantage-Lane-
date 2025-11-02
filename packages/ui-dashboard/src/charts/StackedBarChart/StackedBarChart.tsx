/**
 * StackedBarChart - Multi-series stacked bar chart
 * Perfect for showing breakdown by categories
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
} from 'recharts';
import styles from './StackedBarChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';
import {
  CHART_MARGIN,
  CHART_ANIMATION_DURATION,
  CHART_STROKE_DASH,
  CHART_BAR_RADIUS,
  CHART_DEFAULT_HEIGHT,
} from '../constants';

export type ChartUnit = 'GBP_pence' | 'count' | 'percentage';

export interface StackedBarSeries {
  key: string;
  label: string;
  color?: string;
}

export interface StackedBarDataPoint {
  x: string;
  [key: string]: string | number; // Dynamic keys for series
}

export interface StackedBarChartProps {
  data: StackedBarDataPoint[];
  series: StackedBarSeries[];
  unit?: ChartUnit;
  loading?: boolean;
  height?: number;
  className?: string;
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <div className={styles.tooltipValues}>
        {payload.map((entry, index) => (
          <div key={index} className={styles.tooltipEntry}>
            <span className={styles.tooltipDot} style={{ backgroundColor: entry.color }} />
            <span className={styles.tooltipName}>{entry.name}:</span>
            <span className={styles.tooltipValue}>
              {entry.value !== undefined ? entry.value.toLocaleString('en-GB') : 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StackedBarChart({
  data,
  series,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unit: _unit = 'count',
  loading = false,
  height,
  className = '',
}: StackedBarChartProps) {
  const chartHeight = height ?? CHART_DEFAULT_HEIGHT;
  const defaultColors = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.info,
  ];

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`} style={{ height: chartHeight }}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBar} style={{ height: '70%' }} />
          <div className={styles.skeletonBar} style={{ height: '50%' }} />
          <div className={styles.skeletonBar} style={{ height: '80%' }} />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${styles.container} ${styles.empty} ${className}`} style={{ height: chartHeight }}>
        <p className={styles.emptyText}>No data available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray={CHART_STROKE_DASH} stroke="var(--vl-chart-grid)" />
          <XAxis dataKey="x" stroke="var(--vl-chart-axis)" style={{ fontSize: 'var(--font-xs)' }} />
          <YAxis stroke="var(--vl-chart-axis)" style={{ fontSize: 'var(--font-xs)' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--vl-chart-cursor)' }} />
          <Legend />
          {series.map((s, index) => {
            const isLast = index === series.length - 1;
            const baseProps = {
              key: s.key,
              dataKey: s.key,
              name: s.label,
              stackId: 'stack',
              fill: s.color ?? defaultColors[index % defaultColors.length],
              animationDuration: CHART_ANIMATION_DURATION,
            };
            return isLast ? <Bar {...baseProps} radius={CHART_BAR_RADIUS} /> : <Bar {...baseProps} />;
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
