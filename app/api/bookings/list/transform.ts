/**
 * Bookings List API - Data Transformer
 * Transform raw DB data to API response
 * Segments RETURN bookings into 2 rows, FLEET into N rows
 * Compliant: <200 lines
 */

import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import type { QueryResult, RawBooking } from '@entities/booking/api';

export function transformBookingsData(queryResult: QueryResult): BookingListItem[] {
  const {
    bookings,
    customers,
    segments,
    legs,
    pricing,
    services,
    organizations,
    assignments,
    drivers,
    vehicles,
  } = queryResult;

  // Flatten bookings into segments (RETURN=2 rows, FLEET=N rows, ONEWAY=1 row)
  const rows: BookingListItem[] = [];

  bookings.forEach((booking) => {
    const customer = customers.find((c) => c.id === booking.customer_id);
    const bookingSegments = segments.filter((s) => s.booking_id === booking.id);
    const pickup = bookingSegments.find((s) => s.role === 'pickup');
    const dropoff = bookingSegments.find((s) => s.role === 'dropoff');
    const bookingPricing = pricing.find((p) => p.booking_id === booking.id);
    const bookingServices = services.filter((s) => s.booking_id === booking.id);
    const organization = organizations.find((o) => o.id === booking.organization_id);
    const assignment = assignments.find((a) => a.booking_id === booking.id);
    const bookingLegs = legs.filter((l) => l.parent_booking_id === booking.id);

    const { isUrgent, isNew } = calculateFlags(booking);

    // Base booking data (common for all segments)
    const baseData = {
      customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown',
      customer_phone: customer?.phone || 'N/A',
      customer_email: customer?.email || null,
      customer_total_bookings: customer?.total_rides || 0,
      customer_loyalty_tier:
        (customer?.loyalty_tier as 'bronze' | 'silver' | 'gold' | 'platinum' | null) || null,
      customer_status: (customer?.status as 'active' | 'inactive' | 'suspended' | null) || null,
      customer_total_spent: customer?.total_spent ? parseFloat(String(customer.total_spent)) : 0,

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

      base_price: bookingPricing?.price ? parseFloat(bookingPricing.price) : 0,
      platform_fee: bookingPricing?.platform_fee ? parseFloat(bookingPricing.platform_fee) : 0,
      operator_net: bookingPricing?.operator_net ? parseFloat(bookingPricing.operator_net) : 0,
      driver_payout: bookingPricing?.driver_payout ? parseFloat(bookingPricing.driver_payout) : 0,
      platform_commission_pct: bookingPricing?.platform_commission_pct ? parseFloat(bookingPricing.platform_commission_pct) : null,
      driver_commission_pct: bookingPricing?.driver_commission_pct ? parseFloat(bookingPricing.driver_commission_pct) : null,
      paid_services: bookingServices
        .filter((s: { unit_price: string }) => parseFloat(s.unit_price) > 0)
        .map((s: { service_code: string; unit_price: string; quantity: number }) => ({
          service_code: s.service_code,
          unit_price: parseFloat(s.unit_price),
          quantity: s.quantity,
        })),
      free_services: bookingServices
        .filter((s: { unit_price: string }) => parseFloat(s.unit_price) === 0)
        .map((s: { service_code: string; notes?: string | null }) => ({
          service_code: s.service_code,
          notes: s.notes || null,
        })),
      fare_amount: (() => {
        const basePrice = bookingPricing?.price ? parseFloat(bookingPricing.price) : 0;
        const servicesTotal = bookingServices.reduce((sum: number, s: { unit_price: string; quantity: number }) => {
          return sum + parseFloat(s.unit_price) * s.quantity;
        }, 0);
        return basePrice + servicesTotal;
      })(),
      payment_method: bookingPricing?.payment_method || 'CARD',
      payment_status: bookingPricing?.payment_status || 'pending',
      currency: bookingPricing?.currency || 'GBP',

    };

    // ONEWAY/HOURLY: No legs, use booking data
    if (booking.trip_type === 'oneway' || booking.trip_type === 'hourly') {
      const driver = drivers.find((d) => d.id === booking.assigned_driver_id);
      const vehicle = vehicles.find((v) => v.id === booking.assigned_vehicle_id);
      const pickupLocation = pickup?.place_text || pickup?.place_label || 'N/A';
      const dropoffLocation = dropoff?.place_text || dropoff?.place_label || 'N/A';

      rows.push({
        id: booking.id,
        reference: booking.reference || 'N/A',
        status: mapStatus(booking.status),
        is_urgent: isUrgent,
        is_new: isNew,
        trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet',
        category: booking.category || 'EXEC',
        vehicle_model: booking.vehicle_model,
        pickup_location: pickupLocation,
        destination: dropoffLocation,
        ...baseData,
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
        assigned_by_name: assignment?.assigned_by || null,
        operator_name: organization?.name || null,
        operator_rating: organization?.rating_average || null,
        operator_reviews: organization?.review_count || null,
        source: booking.source || 'web',
        // No legs property for ONEWAY/HOURLY (optional field)
      });
    }
    // RETURN/FLEET: Use legs data
    else if (bookingLegs.length > 0) {
      bookingLegs.forEach((leg) => {
        const legDriver = drivers.find((d) => d.id === leg.assigned_driver_id);
        const legVehicle = vehicles.find((v) => v.id === leg.assigned_vehicle_id);

        rows.push({
          id: `${booking.id}-${String(leg.leg_number).padStart(2, '0')}`,
          reference: `${booking.reference}-${String(leg.leg_number).padStart(2, '0')}`,
          status: mapStatus(leg.status),
          is_urgent: isUrgent,
          is_new: isNew,
          trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet',
          category: booking.category || 'EXEC',
          vehicle_model: booking.vehicle_model,
          pickup_location: leg.pickup_location,
          destination: leg.destination,
          ...baseData,
          scheduled_at: leg.scheduled_at, // Override with leg scheduled_at
          driver_name: legDriver ? `${legDriver.first_name} ${legDriver.last_name}` : null,
          driver_id: leg.assigned_driver_id,
          driver_phone: legDriver?.phone || null,
          driver_email: legDriver?.email || null,
          driver_rating: legDriver?.rating_average || null,
          vehicle_id: leg.assigned_vehicle_id,
          vehicle_make: legVehicle?.make || null,
          vehicle_model_name: legVehicle?.model || null,
          vehicle_year: legVehicle?.year || null,
          vehicle_color: legVehicle?.color || null,
          vehicle_plate: legVehicle?.license_plate || null,
          assigned_at: assignment?.assigned_at || null,
          assigned_by_name: assignment?.assigned_by || null,
          operator_name: organization?.name || null,
          operator_rating: organization?.rating_average || null,
          operator_reviews: organization?.review_count || null,
          source: booking.source || 'web',
          // ✅ Add legs array for RETURN/FLEET bookings
          legs: bookingLegs.map((l) => ({
            id: l.id,
            parent_booking_id: l.parent_booking_id,
            leg_number: l.leg_number,
            leg_type: l.leg_type,
            vehicle_category: l.vehicle_category || null,
            pickup_location: l.pickup_location,
            destination: l.destination,
            scheduled_at: l.scheduled_at,
            distance_miles: l.distance_miles || null,
            duration_min: l.duration_min || null,
            assigned_driver_id: l.assigned_driver_id,
            assigned_vehicle_id: l.assigned_vehicle_id,
            status: l.status,
            leg_price: l.leg_price,
            driver_payout: l.driver_payout,
          })),
        });
      });
    }
  });

  return rows;
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
