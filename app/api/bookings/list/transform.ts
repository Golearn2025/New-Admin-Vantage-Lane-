/**
 * Bookings List API - Data Transformer
 * Transform raw DB data to API response
 * Compliant: <150 lines
 */

import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import type { QueryResult, RawBooking } from './types';

export function transformBookingsData(queryResult: QueryResult): BookingListItem[] {
  const { bookings, customers, segments, pricing, services } = queryResult;

  return bookings.map((booking) => {
    const customer = customers.find((c) => c.id === booking.customer_id);
    const bookingSegments = segments.filter((s) => s.booking_id === booking.id);
    const pickup = bookingSegments.find((s) => s.role === 'pickup');
    const dropoff = bookingSegments.find((s) => s.role === 'dropoff');
    const bookingPricing = pricing.find((p) => p.booking_id === booking.id);
    const bookingServices = services.filter((s) => s.booking_id === booking.id);

    const { isUrgent, isNew } = calculateFlags(booking);

    return {
      id: booking.id,
      reference: booking.reference || 'N/A',
      status: mapStatus(booking.status),
      is_urgent: isUrgent,
      is_new: isNew,

      trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet',
      category: booking.category || 'EXEC',
      vehicle_model: booking.vehicle_model,

      customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown',
      customer_phone: customer?.phone || 'N/A',
      customer_email: customer?.email || null,
      customer_total_bookings: customer?.total_rides || 0,
      customer_loyalty_tier:
        (customer?.loyalty_tier as 'bronze' | 'silver' | 'gold' | 'platinum' | null) || null,
      customer_status: (customer?.status as 'active' | 'inactive' | 'suspended' | null) || null,
      customer_total_spent: customer?.total_spent || 0,

      pickup_location: pickup?.place_text || pickup?.place_label || 'N/A',
      destination: dropoff?.place_text || dropoff?.place_label || 'N/A',

      scheduled_at: booking.start_at,
      created_at: booking.created_at,

      distance_miles: booking.distance_miles ? parseFloat(booking.distance_miles) : null,
      duration_min: booking.duration_min,
      hours: booking.hours,
      passenger_count: booking.passenger_count,
      bag_count: booking.bag_count,
      flight_number: booking.flight_number,

      return_date: booking.return_date,
      return_time: booking.return_time,

      fleet_executive: booking.fleet_executive,
      fleet_s_class: booking.fleet_s_class,
      fleet_v_class: booking.fleet_v_class,
      fleet_suv: booking.fleet_suv,

      // Calculate pricing
      base_price: bookingPricing?.price ? Math.round(parseFloat(bookingPricing.price) * 100) : 0,
      paid_services: bookingServices.map((s) => ({
        service_code: s.service_code,
        unit_price: Math.round(parseFloat(s.unit_price) * 100),
        quantity: s.quantity,
      })),
      // fare_amount = base_price + sum(paid_services)
      fare_amount: (() => {
        const basePrice = bookingPricing?.price
          ? Math.round(parseFloat(bookingPricing.price) * 100)
          : 0;
        const servicesTotal = bookingServices.reduce((sum, s) => {
          return sum + Math.round(parseFloat(s.unit_price) * 100) * s.quantity;
        }, 0);
        return basePrice + servicesTotal;
      })(),
      payment_method: bookingPricing?.payment_method || 'CARD',
      payment_status: bookingPricing?.payment_status || 'pending',
      currency: bookingPricing?.currency || 'GBP',

      driver_name: null,
      driver_id: booking.assigned_driver_id,
      vehicle_id: booking.assigned_vehicle_id,

      operator_name: 'Vantage Lane',
      source: 'web' as const,
    };
  });
}

function calculateFlags(booking: RawBooking): { isUrgent: boolean; isNew: boolean } {
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

function mapStatus(
  dbStatus: string
): 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' {
  switch (dbStatus) {
    case 'NEW':
      return 'pending';
    case 'ASSIGNED':
      return 'assigned';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending';
  }
}
