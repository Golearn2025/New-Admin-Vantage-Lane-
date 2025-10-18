/**
 * Date Period Functions - 100% REUSABLE
 * 
 * Functions for calculating start/end of periods
 * No dependencies on specific app logic
 */

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
  d.setDate(diff);
  return startOfDay(d);
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
