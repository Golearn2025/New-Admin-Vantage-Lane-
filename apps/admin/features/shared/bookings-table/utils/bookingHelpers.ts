/**
 * Bookings Helpers - Utility Functions
 * NO business logic, just formatting & calculations
 * Compliant: <150 lines
 */

import type { BookingListItem } from '@vantage-lane/contracts';

/**
 * Calculate fleet total vehicles
 */
export function calculateFleetTotal(booking: BookingListItem): number {
  if (booking.trip_type !== 'fleet') {
    return 0;
  }

  return (
    (booking.fleet_executive || 0) +
    (booking.fleet_s_class || 0) +
    (booking.fleet_v_class || 0) +
    (booking.fleet_suv || 0)
  );
}

/**
 * Format date to readable string
 */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time to readable string
 */
export function formatTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date and time together
 */
export function formatDateTime(dateStr: string | null, type: 'date' | 'time' | 'full'): string {
  if (!dateStr) return 'N/A';

  switch (type) {
    case 'date':
      return formatDate(dateStr);
    case 'time':
      return formatTime(dateStr);
    case 'full':
      return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
    default:
      return 'N/A';
  }
}

/**
 * Get trip type icon
 */
export function getTripTypeIcon(tripType: string): string {
  switch (tripType) {
    case 'return':
      return '⟲';
    case 'oneway':
      return '→';
    case 'hourly':
      return '⏱';
    case 'fleet':
      return '🚗';
    default:
      return '→';
  }
}

/**
 * Format trip details
 */
export function formatTripDetails(booking: BookingListItem): string {
  if (booking.trip_type === 'hourly') {
    return `${booking.hours || 1}h rental`;
  }

  if (booking.trip_type === 'fleet') {
    const total = calculateFleetTotal(booking);
    return `${total} vehicles`;
  }

  if (booking.distance_miles && booking.duration_min) {
    return `${booking.distance_miles.toFixed(1)} mi • ${booking.duration_min} min`;
  }

  return 'N/A';
}

/**
 * Get vehicle display text
 */
export function getVehicleDisplay(booking: BookingListItem): string {
  if (booking.trip_type === 'fleet') {
    const parts = [];
    if (booking.fleet_executive) parts.push(`${booking.fleet_executive}x Exec`);
    if (booking.fleet_s_class) parts.push(`${booking.fleet_s_class}x S-Class`);
    if (booking.fleet_v_class) parts.push(`${booking.fleet_v_class}x V-Class`);
    if (booking.fleet_suv) parts.push(`${booking.fleet_suv}x SUV`);
    return parts.join(', ') || 'N/A';
  }

  const parts = [];
  if (booking.passenger_count) parts.push(`${booking.passenger_count}x Pass`);
  if (booking.bag_count) parts.push(`${booking.bag_count}x Bags`);
  return parts.join(' • ') || 'N/A';
}
