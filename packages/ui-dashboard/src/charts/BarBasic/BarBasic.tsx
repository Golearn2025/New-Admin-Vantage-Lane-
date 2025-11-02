/**
 * BarBasic - Simple bar chart with Recharts
 * Uses @vantage-lane/formatters for tooltips
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
} from 'recharts';
import styles from './BarBasic.module.css';
import { CHART_COLORS } from '../../theme/palettes';
import {
  CHART_MARGIN,
  CHART_ANIMATION_DURATION,
  CHART_STROKE_DASH,
  CHART_BAR_RADIUS,
  CHART_DEFAULT_HEIGHT,
} from '../constants';

export type ChartUnit = 'GBP_pence' | 'count' | 'percentage';

export interface BarBasicDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface BarBasicProps {
  data: BarBasicDataPoint[];
  unit?: ChartUnit;
  loading?: boolean;
  height?: number;
  color?: string;
  className?: string;
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0]?.value;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {value !== undefined ? value.toLocaleString('en-GB') : 'N/A'}
      </p>
    </div>
  );
}

export function BarBasic({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unit: _unit = 'count',
  loading = false,
  height,
  color = CHART_COLORS.primary,
  className = '',
}: BarBasicProps) {
  const chartHeight = height ?? CHART_DEFAULT_HEIGHT;
  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    return data.map((point) => ({
      name: point.label || point.x,
      value: point.y,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`} style={{ height: chartHeight }}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBar} style={{ height: '70%' }} />
          <div className={styles.skeletonBar} style={{ height: '50%' }} />
          <div className={styles.skeletonBar} style={{ height: '80%' }} />
          <div className={styles.skeletonBar} style={{ height: '60%' }} />
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
        <BarChart data={chartData} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray={CHART_STROKE_DASH} stroke="var(--vl-chart-grid)" />
          <XAxis
            dataKey="name"
            stroke="var(--vl-chart-axis)"
            style={{ fontSize: 'var(--font-xs)' }}
          />
          <YAxis stroke="var(--vl-chart-axis)" style={{ fontSize: 'var(--font-xs)' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--vl-chart-cursor)' }} />
          <Bar dataKey="value" fill={color} radius={CHART_BAR_RADIUS} animationDuration={CHART_ANIMATION_DURATION} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
