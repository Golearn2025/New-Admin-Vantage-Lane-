/**
 * LineChart - Trend line chart with Recharts
 * Perfect for time series and trend visualization
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import styles from './LineChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';
import {
  CHART_MARGIN,
  CHART_ANIMATION_DURATION,
  CHART_STROKE_DASH,
  CHART_DOT_RADIUS,
  CHART_ACTIVE_DOT_RADIUS,
  CHART_DEFAULT_HEIGHT,
} from '../constants';

export type ChartUnit = 'GBP_pence' | 'count' | 'percentage';

export interface LineChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  unit?: ChartUnit;
  loading?: boolean;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
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

export function LineChart({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unit: _unit = 'count',
  loading = false,
  height,
  color = CHART_COLORS.primary,
  strokeWidth = 3,
  showDots = true,
  className = '',
}: LineChartProps) {
  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    return data.map((point) => ({
      name: point.label || point.x,
      value: point.y,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`} style={{ height }}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine} />
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
      <ResponsiveContainer width="100%" height={height ?? CHART_DEFAULT_HEIGHT}>
        <RechartsLineChart data={chartData} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray={CHART_STROKE_DASH} stroke="var(--vl-chart-grid)" />
          <XAxis
            dataKey="name"
            stroke="var(--vl-chart-axis)"
            style={{ fontSize: 'var(--font-xs)' }}
          />
          <YAxis stroke="var(--vl-chart-axis)" style={{ fontSize: 'var(--font-xs)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={showDots ? { fill: color, r: CHART_DOT_RADIUS } : false}
            activeDot={{ r: CHART_ACTIVE_DOT_RADIUS }}
            animationDuration={CHART_ANIMATION_DURATION}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
