/**
 * Bookings List API - Data Transformer
 * Transform raw DB data to API response
 * Compliant: <150 lines
 */

import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import type { QueryResult, RawBooking } from './types';

export function transformBookingsData(queryResult: QueryResult): BookingListItem[] {
  const {
    bookings,
    customers,
    segments,
    pricing,
    services,
    organizations,
    assignments,
    drivers,
    vehicles,
  } = queryResult;

  return bookings.map((booking) => {
    const customer = customers.find((c) => c.id === booking.customer_id);
    const bookingSegments = segments.filter((s) => s.booking_id === booking.id);
    const pickup = bookingSegments.find((s) => s.role === 'pickup');
    const dropoff = bookingSegments.find((s) => s.role === 'dropoff');
    const bookingPricing = pricing.find((p) => p.booking_id === booking.id);
    const bookingServices = services.filter((s) => s.booking_id === booking.id);
    const organization = organizations.find((o) => o.id === booking.organization_id);
    const assignment = assignments.find((a) => a.booking_id === booking.id);
    const driver = drivers.find((d) => d.id === booking.assigned_driver_id);
    const vehicle = vehicles.find((v) => v.id === booking.assigned_vehicle_id);

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
      customer_total_spent: customer?.total_spent ? parseFloat(String(customer.total_spent)) : 0, // Keep as pounds (decimal)

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
      notes: booking.notes,

      return_date: booking.return_date,
      return_time: booking.return_time,
      return_flight_number: booking.return_flight_number,

      fleet_executive: booking.fleet_executive,
      fleet_s_class: booking.fleet_s_class,
      fleet_v_class: booking.fleet_v_class,
      fleet_suv: booking.fleet_suv,

      // Calculate pricing
      base_price: bookingPricing?.price ? Math.round(parseFloat(bookingPricing.price) * 100) : 0,
      paid_services: bookingServices
        .filter((s) => parseFloat(s.unit_price) > 0)
        .map((s) => ({
          service_code: s.service_code,
          unit_price: Math.round(parseFloat(s.unit_price) * 100),
          quantity: s.quantity,
        })),
      free_services: bookingServices
        .filter((s) => parseFloat(s.unit_price) === 0)
        .map((s) => ({
          service_code: s.service_code,
          notes: s.notes || null,
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

      driver_name: driver ? `${driver.first_name} ${driver.last_name}` : null,
      driver_id: booking.assigned_driver_id,
      driver_phone: driver?.phone || null,
      driver_email: driver?.email || null,
      driver_rating: driver?.rating_average || null,
      vehicle_id: booking.assigned_vehicle_id,
      vehicle_make: vehicle?.make || null,
      vehicle_model_name: vehicle?.model || null,
      vehicle_year: vehicle?.year || null,
      vehicle_color: vehicle?.color || null,
      vehicle_plate: vehicle?.license_plate || null,
      assigned_at: assignment?.assigned_at || null,
      assigned_by_name: assignment?.assigned_by || null, // TODO: Fetch admin name

      operator_name: organization?.name || null,
      operator_rating: organization?.rating_average || null,
      operator_reviews: organization?.review_count || null,
      source: booking.source || 'web', // Read from DB, fallback to 'web' if null
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
