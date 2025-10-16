/**
 * LineChart - Trend line chart with Recharts
 * Perfect for time series and trend visualization
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import styles from './LineChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';

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
  unit = 'count',
  loading = false,
  height = 300,
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
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--vl-chart-grid, #e5e7eb)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--vl-chart-axis, #6b7280)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--vl-chart-axis, #6b7280)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone"
            dataKey="value" 
            stroke={color}
            strokeWidth={strokeWidth}
            dot={showDots ? { fill: color, r: 4 } : false}
            activeDot={{ r: 6 }}
            animationDuration={800}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
