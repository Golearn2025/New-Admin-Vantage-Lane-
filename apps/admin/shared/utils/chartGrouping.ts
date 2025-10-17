/**
 * Chart Grouping Utilities - REUSABLE
 * 
 * Smart auto-grouping logic based on date range
 * Follows industry best practices (Google Analytics, Stripe, Shopify)
 */

import { differenceInDays, type DateRange } from '@vantage-lane/ui-dashboard';

export type ChartGrouping = 
  | 'hourly'   // 24 points (hours)
  | 'daily'    // 7-365 points (days)
  | 'weekly'   // ~13 points (weeks)
  | 'monthly'  // 12-24 points (months)
  | 'quarterly' // 4-8 points (quarters)
  | 'yearly';  // N points (years)

export interface GroupingStrategy {
  grouping: ChartGrouping;
  expectedPoints: number;
  label: string;
  sqlGroup: string; // For database GROUP BY
}

/**
 * Determine optimal chart grouping based on date range
 * Follows best practices from major analytics platforms
 */
export function determineChartGrouping(dateRange: DateRange): GroupingStrategy {
  const days = differenceInDays(dateRange.end, dateRange.start) + 1; // +1 to include end date
  
  // Today or Yesterday → Hourly
  if (days <= 1) {
    return {
      grouping: 'hourly',
      expectedPoints: 24,
      label: 'Per Hour',
      sqlGroup: 'hour',
    };
  }
  
  // Last 7 days → Daily
  if (days <= 7) {
    return {
      grouping: 'daily',
      expectedPoints: days,
      label: 'Per Day',
      sqlGroup: 'day',
    };
  }
  
  // Last 31 days (1 month) → Daily
  if (days <= 31) {
    return {
      grouping: 'daily',
      expectedPoints: days,
      label: 'Per Day',
      sqlGroup: 'day',
    };
  }
  
  // Last 90 days (3 months) → Weekly
  if (days <= 90) {
    return {
      grouping: 'weekly',
      expectedPoints: Math.ceil(days / 7),
      label: 'Per Week',
      sqlGroup: 'week',
    };
  }
  
  // Last 365 days (1 year) → Monthly
  if (days <= 365) {
    return {
      grouping: 'monthly',
      expectedPoints: Math.ceil(days / 30),
      label: 'Per Month',
      sqlGroup: 'month',
    };
  }
  
  // Last 730 days (2 years) → Monthly
  if (days <= 730) {
    return {
      grouping: 'monthly',
      expectedPoints: Math.ceil(days / 30),
      label: 'Per Month',
      sqlGroup: 'month',
    };
  }
  
  // More than 2 years → Quarterly
  if (days <= 1825) { // ~5 years
    return {
      grouping: 'quarterly',
      expectedPoints: Math.ceil(days / 90),
      label: 'Per Quarter',
      sqlGroup: 'quarter',
    };
  }
  
  // More than 5 years → Yearly
  return {
    grouping: 'yearly',
    expectedPoints: Math.ceil(days / 365),
    label: 'Per Year',
    sqlGroup: 'year',
  };
}

/**
 * Get SQL GROUP BY clause for Supabase
 */
export function getSQLGroupingClause(grouping: ChartGrouping, dateColumn: string = 'created_at'): string {
  switch (grouping) {
    case 'hourly':
      return `DATE_TRUNC('hour', ${dateColumn})`;
    case 'daily':
      return `DATE_TRUNC('day', ${dateColumn})`;
    case 'weekly':
      return `DATE_TRUNC('week', ${dateColumn})`;
    case 'monthly':
      return `DATE_TRUNC('month', ${dateColumn})`;
    case 'quarterly':
      return `DATE_TRUNC('quarter', ${dateColumn})`;
    case 'yearly':
      return `DATE_TRUNC('year', ${dateColumn})`;
    default:
      return `DATE_TRUNC('day', ${dateColumn})`;
  }
}

/**
 * Format x-axis label based on grouping
 */
export function formatXAxisLabel(date: Date, grouping: ChartGrouping): string {
  switch (grouping) {
    case 'hourly':
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    case 'daily':
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    case 'weekly':
      return `Week ${getWeekNumber(date)}`;
    case 'monthly':
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    case 'quarterly':
      return `Q${getQuarter(date)} ${date.getFullYear()}`;
    case 'yearly':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString('en-GB');
  }
}

/**
 * Get week number of year
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get quarter (1-4) from date
 */
function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * Get recommended chart type based on grouping
 */
export function getRecommendedChartType(grouping: ChartGrouping): 'bar' | 'line' | 'area' {
  switch (grouping) {
    case 'hourly':
    case 'daily':
      return 'bar'; // Better for discrete data points
    case 'weekly':
    case 'monthly':
      return 'line'; // Better for trends
    case 'quarterly':
    case 'yearly':
      return 'line'; // Better for long-term trends
    default:
      return 'bar';
  }
}
