/**
 * Bookings List Types - Enterprise Strict
 * 
 * ZERO any types, complete type safety
 * Maps directly to RPC get_bookings_list output
 */

export type BookingsSort = 'created_at' | 'pickup_time' | 'status' | 'price_total';
export type SortDir = 'asc' | 'desc';

export interface BookingsListParams {
  limit: number;
  offset: number;
  sort: BookingsSort;
  dir: SortDir;
  search?: string | null;
  status?: string | null;
  trip_type?: string | null;
  from?: string | null;
  to?: string | null;
}

export interface BookingRowDTO {
  booking_id: string;
  reference: string | null;
  created_at: string;
  status: string;
  trip_type: string | null;
  pickup_time: string | null;
  pickup_location: string;
  destination: string;
  // Customer
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string;
  customer_status: string | null;
  customer_loyalty_tier: string | null;
  customer_total_rides: number | null;
  customer_total_spent: number | null;
  customer_rating_average: string | number | null;
  customer_rating_count: number | null;
  // Organization
  organization_id: string | null;
  organization_name: string | null;
  // Driver
  driver_id: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_email: string | null;
  // Vehicle
  vehicle_id: string | null;
  vehicle_name: string | null;
  vehicle_category: string | null;
  vehicle_model: string | null;
  // Pricing
  price_total: string | number | null;
  platform_fee: string | number | null;
  operator_net: string | number | null;
  driver_payout: string | number | null;
  extras_total: string | number | null;
  platform_commission_pct: string | number | null;
  driver_commission_pct: string | number | null;
  currency: string | null;
  payment_method: string | null;
  payment_status: string | null;
  // Trip details
  distance_miles: string | number | null;
  duration_min: number | null;
  passenger_count: number | null;
  bag_count: number | null;
  flight_number: string | null;
  notes: string | null;
  // Flags
  is_urgent: boolean | null;
  is_new: boolean | null;
  scheduled_at: string | null;
  // Pagination
  total_count: number;
}

export interface BookingsListResult {
  rows: BookingRowDTO[];
  total: number;
}
