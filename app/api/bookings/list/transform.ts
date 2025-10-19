/**
 * Bookings List API - Data Transformer
 * Transforms raw database data to API response format
 * Compliant: <150 lines
 */

import type { BookingListItem } from '@admin/shared/api/contracts/bookings';
import type { RawBooking, BookingSegment, BookingPricing, Driver, QueryResult } from './types';

/**
 * Transform query results to API response items
 */
export function transformBookingsData(queryResult: QueryResult): BookingListItem[] {
  const { bookings, segments, pricing, drivers } = queryResult;
  
  return bookings.map((booking) => transformSingleBooking(
    booking,
    segments,
    pricing,
    drivers
  ));
}

/**
 * Transform single booking with related data
 */
function transformSingleBooking(
  booking: RawBooking,
  segments: BookingSegment[],
  pricing: BookingPricing[],
  drivers: Driver[]
): BookingListItem {
  // Get related data
  const bookingSegments = segments.filter((s) => s.booking_id === booking.id);
  const pickup = bookingSegments.find((s) => s.role === 'pickup');
  const dropoff = bookingSegments.find((s) => s.role === 'dropoff');
  const bookingPricing = pricing.find((p) => p.booking_id === booking.id);
  const driver = drivers.find((d) => d.id === booking.assigned_driver_id);
  
  // Extract customer info
  const customer = extractCustomer(booking);
  
  // Calculate flags
  const { isUrgent, isNew } = calculateFlags(booking);
  
  // Map status
  const workflowStatus = mapStatus(booking.status);
  
  return {
    id: booking.id,
    reference: booking.reference || 'N/A',
    status: workflowStatus,
    is_urgent: isUrgent,
    is_new: isNew,
    
    // Trip info
    trip_type: booking.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet',
    category: booking.category || 'EXEC',
    vehicle_model: booking.vehicle_model,
    
    // Customer
    customer_name: customer
      ? `${customer.first_name} ${customer.last_name}`
      : 'Unknown',
    customer_phone: customer?.phone || 'N/A',
    customer_total_bookings: customer?.total_rides || 0,
    
    // Locations
    pickup_location: pickup?.place_label || pickup?.place_text || 'N/A',
    destination: dropoff?.place_label || dropoff?.place_text || 'N/A',
    
    // Dates
    scheduled_at: booking.start_at,
    created_at: booking.created_at,
    
    // Trip details
    distance_miles: booking.distance_miles ? parseFloat(booking.distance_miles) : null,
    duration_min: booking.duration_min,
    hours: booking.hours,
    
    // Return trip
    return_date: booking.return_date,
    return_time: booking.return_time,
    
    // Fleet
    fleet_executive: booking.fleet_executive,
    fleet_s_class: booking.fleet_s_class,
    fleet_v_class: booking.fleet_v_class,
    fleet_suv: booking.fleet_suv,
    
    // Pricing
    fare_amount: bookingPricing?.price ? Math.round(parseFloat(bookingPricing.price) * 100) : 0,
    
    // Assignment
    driver_name: driver ? `${driver.first_name} ${driver.last_name}` : null,
    driver_id: booking.assigned_driver_id,
    vehicle_id: booking.assigned_vehicle_id,
    
    // Meta
    operator_name: 'Vantage Lane',
    source: 'web' as const,
  };
}

/**
 * Extract customer from Supabase nested result
 */
function extractCustomer(booking: RawBooking) {
  const customerArray = booking.customers as unknown as Array<{ 
    first_name: string; 
    last_name: string;
    phone: string;
    total_rides: number;
  }> | null;
  
  return customerArray && customerArray.length > 0 ? customerArray[0] : null;
}

/**
 * Calculate URGENT and NEW flags
 */
function calculateFlags(booking: RawBooking): { isUrgent: boolean; isNew: boolean } {
  const now = new Date();
  
  // URGENT: <3h until pickup AND no driver assigned
  const scheduledAt = booking.start_at ? new Date(booking.start_at) : null;
  const hoursUntilPickup = scheduledAt 
    ? (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60) 
    : null;
  const isUrgent = hoursUntilPickup !== null && 
                  hoursUntilPickup > 0 && 
                  hoursUntilPickup <= 3 && 
                  !booking.assigned_driver_id;
  
  // NEW: created in last 24 hours
  const createdAt = new Date(booking.created_at);
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  const isNew = hoursSinceCreation <= 24;
  
  return { isUrgent, isNew };
}

/**
 * Map database status to workflow status
 */
function mapStatus(dbStatus: string): 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' {
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
