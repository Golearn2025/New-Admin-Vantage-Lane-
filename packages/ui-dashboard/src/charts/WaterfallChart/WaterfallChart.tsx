/**
 * WaterfallChart - Financial waterfall visualization
 * Shows cumulative effect of sequential values
 * Simplified version using BarChart
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
  Cell,
} from 'recharts';
import styles from './WaterfallChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';
import {
  CHART_MARGIN,
  CHART_ANIMATION_DURATION,
  CHART_STROKE_DASH,
  CHART_BAR_RADIUS,
  CHART_DEFAULT_HEIGHT,
} from '../constants';

export interface WaterfallDataPoint {
  name: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  loading?: boolean;
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
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

export function WaterfallChart({
  data,
  loading = false,
  height,
  positiveColor = CHART_COLORS.success,
  negativeColor = CHART_COLORS.danger,
  totalColor = CHART_COLORS.primary,
  className = '',
}: WaterfallChartProps) {
  const chartHeight = height ?? CHART_DEFAULT_HEIGHT;
  // Transform data for waterfall effect
  const chartData = React.useMemo(() => {
    let cumulative = 0;
    return data.map((point) => {
      const result = {
        name: point.name,
        value: Math.abs(point.value),
        start: cumulative,
        isTotal: point.isTotal,
        isPositive: point.value >= 0,
      };
      if (!point.isTotal) {
        cumulative += point.value;
      } else {
        cumulative = point.value;
      }
      return result;
    });
  }, [data]);

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`} style={{ height: chartHeight }}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBar} style={{ height: '60%' }} />
          <div className={styles.skeletonBar} style={{ height: '80%' }} />
          <div className={styles.skeletonBar} style={{ height: '40%' }} />
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
          <Bar dataKey="value" radius={CHART_BAR_RADIUS} animationDuration={CHART_ANIMATION_DURATION}>
            {chartData.map((entry, index) => {
              let fillColor = totalColor;
              if (!entry.isTotal) {
                fillColor = entry.isPositive ? positiveColor : negativeColor;
              }
              return <Cell key={`cell-${index}`} fill={fillColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
