/**
 * Date Range Presets - 100% REUSABLE
 * 
 * Convert preset names to actual date ranges
 * No dependencies on specific app logic
 */

import type { DatePreset, DateRange } from './dateTypes';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subtractDays,
} from './datePeriods';

/**
 * Get date range for preset
 */
export function getDateRangeForPreset(preset: DatePreset): DateRange {
  const now = new Date();
  
  switch (preset) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
        preset,
        label: 'Today',
      };
      
    case 'yesterday':
      const yesterday = subtractDays(now, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
        preset,
        label: 'Yesterday',
      };
      
    case 'this_week':
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
        preset,
        label: 'This Week',
      };
      
    case 'last_week':
      const lastWeekDate = subtractDays(now, 7);
      return {
        start: startOfWeek(lastWeekDate),
        end: endOfWeek(lastWeekDate),
        preset,
        label: 'Last Week',
      };
      
    case 'this_month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        preset,
        label: 'This Month',
      };
      
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
        preset,
        label: 'Last Month',
      };
      
    case 'this_quarter':
      return {
        start: startOfQuarter(now),
        end: endOfQuarter(now),
        preset,
        label: 'This Quarter',
      };
      
    case 'last_quarter':
      const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return {
        start: startOfQuarter(lastQuarter),
        end: endOfQuarter(lastQuarter),
        preset,
        label: 'Last Quarter',
      };
      
    case 'this_year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
        preset,
        label: 'This Year',
      };
      
    case 'last_year':
      const lastYear = new Date(now.getFullYear() - 1, 0, 1);
      return {
        start: startOfYear(lastYear),
        end: endOfYear(lastYear),
        preset,
        label: 'Last Year',
      };
      
    case 'last_7_days':
      return {
        start: startOfDay(subtractDays(now, 6)),
        end: endOfDay(now),
        preset,
        label: 'Last 7 Days',
      };
      
    case 'last_30_days':
      return {
        start: startOfDay(subtractDays(now, 29)),
        end: endOfDay(now),
        preset,
        label: 'Last 30 Days',
      };
      
    case 'last_90_days':
      return {
        start: startOfDay(subtractDays(now, 89)),
        end: endOfDay(now),
        preset,
        label: 'Last 90 Days',
      };
      
    case 'last_365_days':
      return {
        start: startOfDay(subtractDays(now, 364)),
        end: endOfDay(now),
        preset,
        label: 'Last 365 Days',
      };
      
    case 'all_time':
      return {
        start: new Date(2020, 0, 1), // Arbitrary old date
        end: endOfDay(now),
        preset,
        label: 'All Time',
      };
      
    case 'custom':
      return {
        start: startOfMonth(now),
        end: endOfDay(now),
        preset,
        label: 'Custom Range',
      };
      
    default:
      return {
        start: startOfMonth(now),
        end: endOfDay(now),
        preset: 'this_month',
        label: 'This Month',
      };
  }
}
