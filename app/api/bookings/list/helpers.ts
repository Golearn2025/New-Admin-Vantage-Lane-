/**
 * Bookings List API - Helper Functions
 * Extracted from transform.ts for better organization
 * < 100 lines
 */

import type { RawBooking } from '@entities/booking/api';

/**
 * Calculate urgency and newness flags for a booking
 */
export function calculateFlags(booking: RawBooking): { isUrgent: boolean; isNew: boolean } {
  const now = new Date();

  const scheduledAt = booking.start_at ? new Date(booking.start_at) : null;
  const hoursUntilPickup = scheduledAt
    ? (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    : null;
  const isUrgent =
    hoursUntilPickup !== null &&
    hoursUntilPickup > 0 &&
    hoursUntilPickup <= 3 &&
    !booking.assigned_driver_id;

  const createdAt = new Date(booking.created_at);
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  const isNew = hoursSinceCreation <= 24;

  return { isUrgent, isNew };
}

/**
 * Map database status to API status
 */
export function mapStatus(
  dbStatus: string
): 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' {
  switch (dbStatus) {
    case 'NEW':
    case 'pending':  // ← Mixed case support
      return 'pending';
    case 'ASSIGNED':
    case 'assigned':  // ← Mixed case support
      return 'assigned';
    case 'ARRIVED':
    case 'arrived':
      return 'arrived';
    case 'EN_ROUTE':
    case 'en_route':
      return 'en_route';
    case 'IN_PROGRESS':
    case 'in_progress': // ← Mixed case support
      return 'in_progress';
    case 'COMPLETED':
    case 'completed':  // ← Mixed case support
      return 'completed';
    case 'CANCELLED':
    case 'cancelled':  // ← Mixed case support
      return 'cancelled';
    default:
      console.warn('Unknown status:', dbStatus);
      return 'pending';
  }
}

/**
 * Parse float safely from database value
 */
export function parseFloatSafe(value: string | null | undefined): number {
  if (!value) return 0;
  return parseFloat(String(value));
}

/**
 * Build base booking data (extracted from transform.ts to reduce file size)
 */
export function buildBaseData(params: {
  booking: Record<string, unknown>;
  customer: Record<string, unknown> | undefined;
  bookingPricing: Record<string, unknown> | undefined;
  bookingServices: Array<Record<string, unknown>>;
}) {
  const { booking, customer, bookingPricing, bookingServices } = params;

  const basePrice = bookingPricing?.price ? parseFloat(String(bookingPricing.price)) : 0;
  const servicesTotal = bookingServices.reduce((sum: number, s: Record<string, unknown>) => {
    return sum + parseFloat(String(s.unit_price)) * Number(s.quantity);
  }, 0);

  return {
    customer_name: customer ? `${String(customer.first_name)} ${String(customer.last_name)}` : 'Unknown',
    customer_phone: (customer?.phone as string) || 'N/A',
    customer_email: (customer?.email as string | null) || null,
    customer_total_bookings: Number(customer?.total_rides) || 0,
    customer_loyalty_tier:
      (customer?.loyalty_tier as 'bronze' | 'silver' | 'gold' | 'platinum' | null) || null,
    customer_status: (customer?.status as 'active' | 'inactive' | 'suspended' | null) || null,
    customer_total_spent: customer?.total_spent ? parseFloat(String(customer.total_spent)) : 0,

    scheduled_at: booking.start_at as string,
    created_at: booking.created_at as string,

    distance_miles: booking.distance_miles ? parseFloat(String(booking.distance_miles)) : null,
    duration_min: Number(booking.duration_min) || null,
    hours: Number(booking.hours) || null,
    passenger_count: Number(booking.passenger_count) || null,
    bag_count: Number(booking.bag_count) || null,
    flight_number: (booking.flight_number as string | null) || null,
    notes: (booking.notes as string | null) || null,

    return_date: (booking.return_date as string | null) || null,
    return_time: (booking.return_time as string | null) || null,
    return_flight_number: (booking.return_flight_number as string | null) || null,

    fleet_executive: Number(booking.fleet_executive) || null,
    fleet_s_class: Number(booking.fleet_s_class) || null,
    fleet_v_class: Number(booking.fleet_v_class) || null,
    fleet_suv: Number(booking.fleet_suv) || null,

    base_price: basePrice,
    platform_fee: bookingPricing?.platform_fee ? parseFloat(String(bookingPricing.platform_fee)) : 0,
    operator_net: bookingPricing?.operator_net ? parseFloat(String(bookingPricing.operator_net)) : 0,
    driver_payout: bookingPricing?.driver_payout ? parseFloat(String(bookingPricing.driver_payout)) : 0,
    platform_commission_pct: bookingPricing?.platform_commission_pct
      ? parseFloat(String(bookingPricing.platform_commission_pct))
      : null,
    driver_commission_pct: bookingPricing?.driver_commission_pct
      ? parseFloat(String(bookingPricing.driver_commission_pct))
      : null,
    paid_services: bookingServices
      .filter((s: Record<string, unknown>) => parseFloat(String(s.unit_price)) > 0)
      .map((s: Record<string, unknown>) => ({
        service_code: String(s.service_code),
        unit_price: parseFloat(String(s.unit_price)),
        quantity: Number(s.quantity),
      })),
    free_services: bookingServices
      .filter((s: Record<string, unknown>) => parseFloat(String(s.unit_price)) === 0)
      .map((s: Record<string, unknown>) => ({
        service_code: String(s.service_code),
        notes: s.notes ? String(s.notes) : null,
      })),
    fare_amount: basePrice + servicesTotal,
    payment_method: (bookingPricing?.payment_method as string) || 'CARD',
    payment_status: (bookingPricing?.payment_status as string) || 'pending',
    currency: (bookingPricing?.currency as string) || 'GBP',
  };
}
