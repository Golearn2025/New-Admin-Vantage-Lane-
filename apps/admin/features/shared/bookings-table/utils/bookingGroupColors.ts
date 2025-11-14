/**
 * Booking Group Colors Utility
 * 
 * Generates consistent colors for booking legs to visually group
 * fleet/return bookings that are split into multiple rows.
 * 
 * Compliant:
 * - TypeScript strict
 * - Pure functions (no side effects)
 * - < 50 lines per function
 */

/**
 * CSS class names for booking group colors
 * Maps to BookingsTable.module.css classes
 */
const COLOR_CLASSES = [
  'groupBlue',
  'groupGreen',
  'groupAmber',
  'groupViolet',
  'groupPink',
  'groupCyan',
  'groupOrange',
  'groupIndigo',
] as const;

/**
 * Extract parent booking ID from a leg row ID
 * 
 * @param rowId - Row ID (e.g., "CB-00105-01")
 * @returns Parent booking ID or null if not a leg
 * 
 * @example
 * getParentBookingId("CB-00105-01") → "CB-00105"
 * getParentBookingId("CB-00105-10") → "CB-00105"
 * getParentBookingId("CB-00105") → null (not a leg)
 */
export function getParentBookingId(rowId: string): string | null {
  // Match pattern: anything-DD where DD is 2 digits
  const match = rowId.match(/^(.+)-(\d{2})$/);
  return match ? match[1] || null : null;
}

/**
 * Generate a consistent CSS class name from a string using hash function
 * 
 * @param str - String to hash (e.g., parent booking ID)
 * @returns CSS class name from palette
 * 
 * @example
 * generateColorClassFromString("CB-00105") → "groupBlue" (always same)
 * generateColorClassFromString("MEGA-121") → "groupGreen" (different)
 */
export function generateColorClassFromString(str: string): string {
  // Simple hash function: sum of char codes
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Map hash to color class index (always positive)
  const index = Math.abs(hash) % COLOR_CLASSES.length;
  return COLOR_CLASSES[index] || COLOR_CLASSES[0];
}

/**
 * Get group indicator CSS class for a booking row
 * 
 * @param rowId - Row ID to check
 * @returns CSS class name or null if not part of a group
 * 
 * @example
 * getBookingGroupClass("CB-00105-01") → "groupBlue"
 * getBookingGroupClass("CB-00105") → null (not a leg)
 */
export function getBookingGroupClass(rowId: string): string | null {
  const parentId = getParentBookingId(rowId);
  return parentId ? generateColorClassFromString(parentId) : null;
}
