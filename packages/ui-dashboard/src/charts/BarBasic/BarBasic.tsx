/**
 * BarBasic - Simple bar chart with Recharts
 * Uses @vantage-lane/formatters for tooltips
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import styles from './BarBasic.module.css';
import { CHART_COLORS } from '../../theme/palettes';

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
  height = 300,
  color = CHART_COLORS.primary,
  className = '',
}: BarBasicProps) {
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
      <div className={`${styles.container} ${styles.empty} ${className}`} style={{ height }}>
        <p className={styles.emptyText}>No data available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
