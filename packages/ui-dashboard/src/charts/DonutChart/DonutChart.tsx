/**
 * DonutChart - Pie chart with center hole
 * Perfect for showing distribution and percentages
 * NO hardcoded colors - only CSS vars
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps, Legend } from 'recharts';
import styles from './DonutChart.module.css';
import { CHART_COLORS } from '../../theme/palettes';
import {
  CHART_ANIMATION_DURATION,
  CHART_PADDING_ANGLE,
  CHART_DEFAULT_HEIGHT,
} from '../constants';

export interface DonutChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartDataPoint[];
  loading?: boolean;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

// Custom Tooltip
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const value = data?.value;
  const name = data?.name;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{name}</p>
      <p className={styles.tooltipValue}>
        {value !== undefined ? value.toLocaleString('en-GB') : 'N/A'}
      </p>
    </div>
  );
}

export function DonutChart({
  data,
  loading = false,
  height,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  className = '',
}: DonutChartProps) {
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
          <div className={styles.skeletonDonut} />
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={CHART_PADDING_ANGLE}
            dataKey="value"
            animationDuration={CHART_ANIMATION_DURATION}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
