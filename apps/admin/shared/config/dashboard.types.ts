/**
 * Dashboard Types - Centralized Type Definitions
 * Spec-driven architecture for cards and charts
 */

export type WindowPreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'all'
  | 'custom';

export type CardUnit = 'GBP_pence' | 'count' | 'percentage';
export type CardFormat = 'currency' | 'number' | 'percent';
export type ChartType = 'bar' | 'line' | 'stacked_bar' | 'donut' | 'waterfall';

export interface CardSpec {
  key: string;
  title: string;
  subtitle?: string;
  unit: CardUnit;
  format: CardFormat;
  priority: number;
  windows: WindowPreset[];
  defaultWindow: WindowPreset;
  field: string;
  fallback?: {
    value_null: string;
    reason?: string;
    tooltip?: string;
  };
  access: Array<'admin' | 'operator'>;
}

export interface ChartSpec {
  key: string;
  title: string;
  type: ChartType;
  dimensions: { x: string };
  metrics: Array<{ field: string; label: string; color?: string }>;
  windows: WindowPreset[];
  defaultWindow: WindowPreset;
  display: {
    x_axis_label: string;
    y_axis_label: string;
    tooltip: string[];
    height: number;
  };
  access: Array<'admin' | 'operator'>;
}
