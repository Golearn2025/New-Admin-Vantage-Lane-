/**
 * Booking Transform Utilities
 * 
 * Data transformation functions for bookings - focused on data mapping
 */

import type { BookingListItem } from '@vantage-lane/contracts';

/**
 * Transform raw DB booking data to BookingListItem format
 * Used for realtime injection of new bookings
 */
export function transformRawBookingToListItem(rawBooking: any): BookingListItem {
  return {
    id: rawBooking.id,
    reference: rawBooking.reference || 'N/A',
    status: 'pending' as const, // Always show as pending initially
    customer_name: rawBooking.customer_name || 'New Customer',
    pickup_location: rawBooking.pickup_address || 'Pickup Location TBD',
    destination: rawBooking.dropoff_address || 'Destination TBD',
    scheduled_at: rawBooking.pickup_time,
    created_at: rawBooking.created_at,
    trip_type: 'oneway' as const,
    fare_amount: typeof rawBooking.price_total === 'string' ? 
      parseFloat(rawBooking.price_total) * 100 : 
      (rawBooking.price_total || 0) * 100,
    currency: rawBooking.currency || 'GBP',
    operator_name: rawBooking.organization_name || '',
    driver_name: rawBooking.driver_name || null,
    
    // Minimal required fields
    is_urgent: false,
    is_new: true, // Mark as new for 24h
    category: 'EXEC',
    vehicle_model: null,
    customer_phone: '',
    customer_email: null,
    customer_total_bookings: 0,
    customer_loyalty_tier: null,
    customer_status: null,
    customer_total_spent: 0,
    distance_miles: null,
    duration_min: null,
    hours: null,
    passenger_count: null,
    bag_count: null,
    flight_number: null,
    notes: null,
    return_date: null,
    return_time: null,
    return_flight_number: null,
    fleet_executive: null,
    fleet_s_class: null,
    fleet_v_class: null,
    fleet_suv: null,
    base_price: typeof rawBooking.price_total === 'string' ? 
      parseFloat(rawBooking.price_total) * 100 : 
      (rawBooking.price_total || 0) * 100,
    platform_fee: 0,
    operator_net: typeof rawBooking.price_total === 'string' ? 
      parseFloat(rawBooking.price_total) * 100 : 
      (rawBooking.price_total || 0) * 100,
    driver_payout: 0,
    platform_commission_pct: null,
    driver_commission_pct: null,
    paid_services: [],
    free_services: [],
    payment_method: 'CARD',
    payment_status: 'pending',
    driver_id: rawBooking.driver_id,
    driver_phone: null,
    driver_email: null,
    driver_rating: null,
    vehicle_id: rawBooking.vehicle_id,
    vehicle_make: null,
    vehicle_model_name: rawBooking.vehicle_name,
    vehicle_year: null,
    vehicle_color: null,
    vehicle_plate: null,
    assigned_at: null,
    assigned_by_name: null,
    operator_rating: null,
    operator_reviews: null,
    source: 'web' as const,
    legs: [],
  };
}
