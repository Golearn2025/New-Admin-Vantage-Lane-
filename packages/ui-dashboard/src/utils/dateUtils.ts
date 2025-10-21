/**
 * Date Utilities - 100% REUSABLE
 *
 * Centralized exports + formatting utilities
 * Pure functions for date calculations
 * No dependencies on specific app logic
 */

// Re-export types
export type { DatePreset, DateRange } from './dateTypes';

// Import and re-export period functions
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
  differenceInDays,
} from './datePeriods';

export {
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
  differenceInDays,
};

// Re-export preset functions
export { getDateRangeForPreset } from './dateRangePresets';

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
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get previous period for comparison
 */
export function getPreviousPeriod(
  start: Date,
  end: Date
): { start: Date; end: Date; label: string } {
  const days = differenceInDays(end, start);
  const prevEnd = subtractDays(start, 1);
  const prevStart = subtractDays(prevEnd, days);

  return {
    start: startOfDay(prevStart),
    end: endOfDay(prevEnd),
    label: `${formatDateForDisplay(prevStart)} - ${formatDateForDisplay(prevEnd)}`,
  };
}
