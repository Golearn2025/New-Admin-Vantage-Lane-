/**
 * WaterfallChart - Financial waterfall visualization
 * Shows cumulative effect of sequential values
 * Simplified version using BarChart
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Cell } from 'recharts';
import styles from './WaterfallChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';

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
  height = 300,
  positiveColor = CHART_COLORS.success,
  negativeColor = CHART_COLORS.danger,
  totalColor = CHART_COLORS.primary,
  className = '',
}: WaterfallChartProps) {
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
      <div className={`${styles.container} ${className}`} style={{ height }}>
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
          <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
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
