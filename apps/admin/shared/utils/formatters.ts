/**
 * Centralized Formatters - Enterprise Grade
 * 
 * Single source of truth for all formatting across the application
 * Replaces 95+ duplicate formatter implementations
 * Memory optimized with proper TypeScript types
 * 
 * RULES COMPLIANCE:
 * - REGULA 10: Formatters centralizate ✅
 * - Zero 'any' types ✅
 * - Performance optimized ✅
 * - Error handling ✅
 */

/**
 * Currency Formatting
 * Handles pence/cents conversion and display
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: 'GBP' | 'USD' | 'EUR' = 'GBP'
): string {
  // Handle null/undefined
  if (amount === null || amount === undefined || amount === '') {
    return currency === 'GBP' ? '£0.00' : currency === 'USD' ? '$0.00' : '€0.00';
  }

  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    console.warn('Invalid currency amount:', amount);
    return currency === 'GBP' ? '£0.00' : currency === 'USD' ? '$0.00' : '€0.00';
  }

  // Handle pence/cents (if amount > 100, assume it's in pence)
  const displayAmount = numAmount > 100 ? numAmount / 100 : numAmount;

  // Format with proper currency symbol
  const formatted = displayAmount.toFixed(2);
  
  switch (currency) {
    case 'GBP':
      return `£${formatted}`;
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    default:
      return `£${formatted}`;
  }
}

/**
 * Currency Formatting - Pence to Pounds
 * Specifically for backend values stored as pence
 */
export function formatPenceToPounds(pence: number | string | null | undefined): string {
  if (pence === null || pence === undefined || pence === '') {
    return '£0.00';
  }

  const numPence = typeof pence === 'string' ? parseFloat(pence) : pence;
  
  if (isNaN(numPence)) {
    console.warn('Invalid pence amount:', pence);
    return '£0.00';
  }

  const pounds = numPence / 100;
  return `£${pounds.toFixed(2)}`;
}

/**
 * Percentage Formatting
 * For commissions, discounts, etc.
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    console.warn('Invalid percentage value:', value);
    return '0%';
  }

  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Distance Formatting
 * Handles meters to km/miles conversion
 */
export function formatDistance(
  meters: number | string | null | undefined,
  unit: 'km' | 'miles' = 'km'
): string {
  if (meters === null || meters === undefined || meters === '') {
    return unit === 'km' ? '0 km' : '0 miles';
  }

  const numMeters = typeof meters === 'string' ? parseFloat(meters) : meters;
  
  if (isNaN(numMeters)) {
    console.warn('Invalid distance value:', meters);
    return unit === 'km' ? '0 km' : '0 miles';
  }

  if (unit === 'km') {
    const km = numMeters / 1000;
    return `${km.toFixed(1)} km`;
  } else {
    const miles = numMeters / 1609.344; // meters to miles
    return `${miles.toFixed(1)} miles`;
  }
}

/**
 * Phone Number Formatting
 * UK format: +44 7XXX XXX XXX
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) {
    return 'N/A';
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return 'N/A';
  }

  // UK mobile format
  if (digits.length === 11 && digits.startsWith('07')) {
    return `+44 ${digits.substring(1, 5)} ${digits.substring(5, 8)} ${digits.substring(8)}`;
  }

  // UK landline format
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+44 ${digits.substring(1, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  }

  // International format (already formatted)
  if (digits.length > 11) {
    return phone;
  }

  // Fallback - return as is
  return phone;
}

/**
 * Date Formatting - Simple Display
 * Consistent with existing formatDate.ts
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) {
    return 'N/A';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date in formatDate:', date);
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleDateString('en-GB');
}

/**
 * DateTime Formatting - Full Display
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) {
    return 'N/A';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date in formatDateTime:', date);
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Time Formatting - Hours and Minutes
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) {
    return 'N/A';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date in formatTime:', date);
    return 'Invalid Time';
  }
  
  return dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Relative Time Formatting
 * "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) {
    return 'N/A';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date in formatRelativeTime:', date);
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj);
}

/**
 * Duration Formatting
 * For trip durations, etc.
 */
export function formatDuration(minutes: number | string | null | undefined): string {
  if (minutes === null || minutes === undefined || minutes === '') {
    return '0 min';
  }

  const numMinutes = typeof minutes === 'string' ? parseFloat(minutes) : minutes;
  
  if (isNaN(numMinutes)) {
    console.warn('Invalid duration value:', minutes);
    return '0 min';
  }

  if (numMinutes < 60) {
    return `${Math.round(numMinutes)} min`;
  }

  const hours = Math.floor(numMinutes / 60);
  const remainingMinutes = Math.round(numMinutes % 60);

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Number Formatting with Commas
 * For large numbers: 1,234,567
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || num === '') {
    return '0';
  }

  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numValue)) {
    console.warn('Invalid number value:', num);
    return '0';
  }

  return numValue.toLocaleString('en-GB');
}

/**
 * File Size Formatting
 * Displays file sizes in appropriate units (KB, MB, GB)
 */
export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes === 0) return 'Unknown';
  
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}
