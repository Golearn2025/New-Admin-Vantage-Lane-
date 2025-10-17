/**
 * Date Utilities - 100% REUSABLE
 * 
 * Pure functions for date calculations
 * No dependencies on specific app logic
 * Can be used in ANY project
 */

export type DatePreset = 
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_365_days'
  | 'all_time'
  | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
  preset?: DatePreset;
  label: string;
}

/**
 * Get start of day (00:00:00)
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day (23:59:59)
 */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get start of week (Monday)
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return startOfDay(new Date(d.setDate(diff)));
}

/**
 * Get end of week (Sunday)
 */
export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

/**
 * Get start of quarter
 */
export function startOfQuarter(date: Date): Date {
  const quarter = Math.floor(date.getMonth() / 3);
  return startOfDay(new Date(date.getFullYear(), quarter * 3, 1));
}

/**
 * Get end of quarter
 */
export function endOfQuarter(date: Date): Date {
  const quarter = Math.floor(date.getMonth() / 3);
  return endOfDay(new Date(date.getFullYear(), (quarter + 1) * 3, 0));
}

/**
 * Get start of year
 */
export function startOfYear(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), 0, 1));
}

/**
 * Get end of year
 */
export function endOfYear(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), 11, 31));
}

/**
 * Subtract days from date
 */
export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * Calculate difference in days between two dates
 */
export function differenceInDays(endDate: Date, startDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / msPerDay);
}

/**
 * Get date range for preset
 */
export function getDateRangeForPreset(preset: DatePreset): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  
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

/**
 * Format date for API (ISO 8601)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
  
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Get previous period for comparison
 */
export function getPreviousPeriod(start: Date, end: Date): DateRange {
  const days = differenceInDays(end, start);
  const prevEnd = subtractDays(start, 1);
  const prevStart = subtractDays(prevEnd, days);
  
  return {
    start: startOfDay(prevStart),
    end: endOfDay(prevEnd),
    label: `${formatDateForDisplay(prevStart)} - ${formatDateForDisplay(prevEnd)}`,
  };
}
