/**
 * Dashboard Charts Configuration
 * Chart specifications for dashboard visualizations
 */

import type { ChartSpec } from './dashboard.types';

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
