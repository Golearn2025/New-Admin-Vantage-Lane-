/**
 * StackedBarChart - Multi-series stacked bar chart
 * Perfect for showing breakdown by categories
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Legend } from 'recharts';
import styles from './StackedBarChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';

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
            <span 
              className={styles.tooltipDot} 
              style={{ backgroundColor: entry.color }}
            />
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
  height = 300,
  className = '',
}: StackedBarChartProps) {
  const defaultColors = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.info,
  ];

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`} style={{ height }}>
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
      <div className={`${styles.container} ${styles.empty} ${className}`} style={{ height }}>
        <p className={styles.emptyText}>No data available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--vl-chart-grid, #e5e7eb)" />
          <XAxis 
            dataKey="x" 
            stroke="var(--vl-chart-axis, #6b7280)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--vl-chart-axis, #6b7280)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Legend />
          {series.map((s, index) => {
            const isLast = index === series.length - 1;
            const baseProps = {
              key: s.key,
              dataKey: s.key,
              name: s.label,
              stackId: "stack",
              fill: s.color ?? defaultColors[index % defaultColors.length],
              animationDuration: 800,
            };
            return isLast ? (
              <Bar {...baseProps} radius={[8, 8, 0, 0]} />
            ) : (
              <Bar {...baseProps} />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
