/**
 * Dashboard Specification - Centralized Config
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

export const DASHBOARD_CARDS: CardSpec[] = [
  // ROW 1: Financial Overview
  {
    key: 'total_revenue',
    title: 'Total Revenue',
    subtitle: 'Selected period',
    unit: 'GBP_pence',
    format: 'currency',
    priority: 1,
    windows: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'total_revenue_pence',
    access: ['admin', 'operator'],
  },
  {
    key: 'total_bookings',
    title: 'Total Bookings',
    subtitle: 'All statuses',
    unit: 'count',
    format: 'number',
    priority: 2,
    windows: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'total_bookings',
    access: ['admin', 'operator'],
  },
  {
    key: 'avg_booking_value',
    title: 'Average Booking Value',
    subtitle: 'Per booking',
    unit: 'GBP_pence',
    format: 'currency',
    priority: 3,
    windows: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'avg_booking_pence',
    access: ['admin', 'operator'],
  },
  {
    key: 'platform_commission',
    title: 'Platform Commission',
    subtitle: 'Our earnings',
    unit: 'GBP_pence',
    format: 'currency',
    priority: 4,
    windows: ['this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'platform_commission_pence',
    access: ['admin'],
  },
  // ROW 2: Operations & Future
  {
    key: 'operator_payout',
    title: 'Operator Payout',
    subtitle: 'To be paid',
    unit: 'GBP_pence',
    format: 'currency',
    priority: 5,
    windows: ['this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'operator_payout_pence',
    access: ['admin'],
  },
  {
    key: 'cancelled_bookings',
    title: 'Cancelled Bookings',
    subtitle: 'Cancellations',
    unit: 'count',
    format: 'number',
    priority: 6,
    windows: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'cancelled_count',
    access: ['admin', 'operator'],
  },
  {
    key: 'refunds_total',
    title: 'Refunds',
    subtitle: 'Returned to customers',
    unit: 'GBP_pence',
    format: 'currency',
    priority: 7,
    windows: ['this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'all'],
    defaultWindow: 'this_month',
    field: 'refunds_total_pence',
    fallback: { value_null: '£0.00', reason: 'no_data', tooltip: 'No refunds yet' },
    access: ['admin'],
  },
  {
    key: 'scheduled_bookings',
    title: 'Scheduled Bookings',
    subtitle: 'Upcoming',
    unit: 'count',
    format: 'number',
    priority: 8,
    windows: ['custom'],
    defaultWindow: 'custom',
    field: 'scheduled_count',
    access: ['admin', 'operator'],
  },
];

export const DASHBOARD_CHARTS: ChartSpec[] = [
  {
    key: 'bar_daily_completed',
    title: 'Daily Completed Bookings',
    type: 'bar',
    dimensions: { x: 'day' },
    metrics: [
      { field: 'completed_count', label: 'Bookings', color: 'primary' },
      { field: 'gmv_pence', label: 'Revenue (£)', color: 'success' },
    ],
    windows: ['this_week', 'last_week', 'this_month', 'last_month', 'custom'],
    defaultWindow: 'this_month',
    display: {
      x_axis_label: 'Date',
      y_axis_label: 'Bookings',
      tooltip: ['day', 'completed_count', 'gmv'],
      height: 300,
    },
    access: ['admin', 'operator'],
  },
  {
    key: 'line_cumulative_revenue',
    title: 'Cumulative Revenue',
    type: 'line',
    dimensions: { x: 'day' },
    metrics: [{ field: 'cumulative_pence', label: 'Revenue (£)', color: 'success' }],
    windows: ['this_month', 'last_month', 'this_year', 'custom'],
    defaultWindow: 'this_month',
    display: {
      x_axis_label: 'Date',
      y_axis_label: 'Revenue (£)',
      tooltip: ['day', 'daily', 'cumulative'],
      height: 300,
    },
    access: ['admin', 'operator'],
  },
  {
    key: 'stacked_bar_pipeline',
    title: 'Pipeline by Status',
    type: 'stacked_bar',
    dimensions: { x: 'day' },
    metrics: [
      { field: 'NEW', label: 'New', color: 'info' },
      { field: 'COMPLETED', label: 'Completed', color: 'success' },
      { field: 'CANCELLED', label: 'Cancelled', color: 'error' },
    ],
    windows: ['this_week', 'last_week', 'this_month', 'custom'],
    defaultWindow: 'this_week',
    display: {
      x_axis_label: 'Date',
      y_axis_label: 'Count',
      tooltip: ['day', 'status', 'count'],
      height: 300,
    },
    access: ['admin', 'operator'],
  },
  {
    key: 'bar_upcoming',
    title: 'Upcoming Bookings (Next 14d)',
    type: 'bar',
    dimensions: { x: 'day' },
    metrics: [
      { field: 'booking_count', label: 'Bookings', color: 'primary' },
      { field: 'revenue_pence', label: 'Revenue (£)', color: 'success' },
    ],
    windows: ['custom'],
    defaultWindow: 'custom',
    display: {
      x_axis_label: 'Date',
      y_axis_label: 'Bookings',
      tooltip: ['day', 'booking_count', 'revenue'],
      height: 300,
    },
    access: ['admin', 'operator'],
  },
  {
    key: 'donut_status',
    title: 'Status Distribution',
    type: 'donut',
    dimensions: { x: 'status' },
    metrics: [{ field: 'count', label: 'Bookings', color: 'auto' }],
    windows: ['all'],
    defaultWindow: 'all',
    display: {
      x_axis_label: '',
      y_axis_label: '',
      tooltip: ['status', 'count'],
      height: 300,
    },
    access: ['admin', 'operator'],
  },
  {
    key: 'waterfall_financials',
    title: 'Financial Waterfall',
    type: 'waterfall',
    dimensions: { x: 'category' },
    metrics: [{ field: 'value', label: 'Amount (£)', color: 'auto' }],
    windows: ['this_month', 'last_month', 'custom'],
    defaultWindow: 'this_month',
    display: {
      x_axis_label: 'Category',
      y_axis_label: 'Amount (£)',
      tooltip: ['category', 'value'],
      height: 300,
    },
    access: ['admin'],
  },
];

export const WINDOW_PRESETS: Record<WindowPreset, { label: string; description: string }> = {
  today: { label: 'Today', description: 'Current day' },
  yesterday: { label: 'Yesterday', description: 'Previous day' },
  this_week: { label: 'This Week', description: 'Current week' },
  last_week: { label: 'Last Week', description: 'Previous week' },
  this_month: { label: 'This Month', description: 'Current month' },
  last_month: { label: 'Last Month', description: 'Previous month' },
  this_year: { label: 'This Year', description: 'Current year' },
  all: { label: 'All Time', description: 'All available data' },
  custom: { label: 'Custom Range', description: 'Select date range' },
};
