/**
 * Bookings List API - Data Transformer
 * Transform raw DB data to API response
 * Segments RETURN bookings into 2 rows, FLEET into N rows
 * Compliant: <200 lines
 */

import type { BookingListItem } from '@admin-shared/api/contracts/bookings';
import type { QueryResult } from '@entities/booking/api';
import { buildBaseData, calculateFlags, mapStatus } from './helpers';

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

    // Base booking data (common for all segments) - extracted to helper
    const baseData = buildBaseData({
      booking: booking as unknown as Record<string, unknown>,
      customer: customer as unknown as Record<string, unknown> | undefined,
      bookingPricing: bookingPricing as unknown as Record<string, unknown> | undefined,
      bookingServices: bookingServices as unknown as Array<Record<string, unknown>>,
    });

    // Use legs data if available (preferred), fallback to segments
    if (bookingLegs.length === 0) {
      // No legs - use segments as fallback
      const driver = drivers.find((d) => d.id === booking.assigned_driver_id);
      const vehicle = vehicles.find((v) => v.id === booking.assigned_vehicle_id)
        || (booking.assigned_driver_id ? vehicles.find((v) => v.driver_id === booking.assigned_driver_id) : undefined);
      const pickupLocation = pickup?.place_text || pickup?.place_label || 'N/A';
      const dropoffLocation = dropoff?.place_text || dropoff?.place_label || 'N/A';

      const mappedStatus = mapStatus(booking.status);
      // console.log(`🔍 TRANSFORM DEBUG: ${booking.reference} - DB status: "${booking.status}" → API status: "${mappedStatus}"`);
      
      rows.push({
        id: booking.id,
        reference: booking.reference || 'N/A',
        status: mappedStatus,
        is_urgent: isUrgent,
        is_new: isNew,
        trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet',
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
        arrived_at_pickup: null,
        passenger_onboard_at: null,
        started_at: null,
        completed_at: null,
        cancelled_at: null,
        cancel_reason: null,
        operator_name: organization?.name || null,
        operator_rating: organization?.rating_average || null,
        operator_reviews: organization?.review_count || null,
        source: booking.source || 'web',
      });
    }
    // Has legs: Use legs data (preferred for all trip types)
    else {
      bookingLegs.forEach((leg) => {
        const legDriver = drivers.find((d) => d.id === leg.assigned_driver_id);
        const legVehicle = vehicles.find((v) => v.id === leg.assigned_vehicle_id)
          || (leg.assigned_driver_id ? vehicles.find((v) => v.driver_id === leg.assigned_driver_id) : undefined);

        const legMappedStatus = mapStatus(leg.status);
        // console.log(`🔍 LEG TRANSFORM DEBUG: ${booking.reference} leg ${leg.leg_number} - DB status: "${leg.status}" → API status: "${legMappedStatus}"`);
        
        rows.push({
          // For oneway/hourly with 1 leg, use original ID/reference to avoid confusion
          id: booking.trip_type === 'oneway' || booking.trip_type === 'hourly' ? booking.id : `${booking.id}-${String(leg.leg_number).padStart(2, '0')}`,
          reference: booking.trip_type === 'oneway' || booking.trip_type === 'hourly' ? (booking.reference || 'N/A') : `${booking.reference || 'N/A'}-${String(leg.leg_number).padStart(2, '0')}`,
          status: legMappedStatus,
          is_urgent: isUrgent,
          is_new: isNew,
          trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet',
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
          assigned_at: leg.assigned_at || assignment?.assigned_at || null,
          assigned_by_name: assignment?.assigned_by || null,
          arrived_at_pickup: leg.arrived_at_pickup || null,
          passenger_onboard_at: leg.passenger_onboard_at || null,
          started_at: leg.started_at || null,
          completed_at: leg.completed_at || null,
          cancelled_at: leg.cancelled_at || null,
          cancel_reason: leg.cancel_reason || null,
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

