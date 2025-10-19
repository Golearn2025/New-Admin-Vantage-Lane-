/**
 * Bookings List API - Type Definitions
 * Shared types for query builder and transformers
 */

export interface QueryParams {
  page: number;
  pageSize: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | null;
}

export interface RawBooking {
  id: string;
  reference: string | null;
  status: string;
  booking_status: string;
  trip_type: string;
  category: string | null;
  vehicle_model: string | null;
  start_at: string | null;
  created_at: string;
  customer_id: string;
  assigned_driver_id: string | null;
  assigned_vehicle_id: string | null;
  distance_miles: string | null;
  duration_min: number | null;
  hours: number | null;
  return_date: string | null;
  return_time: string | null;
  return_flight_number: string | null;
  fleet_executive: number | null;
  fleet_s_class: number | null;
  fleet_v_class: number | null;
  fleet_suv: number | null;
  customers: unknown;
}

export interface BookingSegment {
  booking_id: string;
  seq_no: number;
  role: string;
  place_text: string;
  place_label: string;
}

export interface BookingPricing {
  booking_id: string;
  price: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

export interface QueryResult {
  bookings: RawBooking[];
  totalCount: number;
  segments: BookingSegment[];
  pricing: BookingPricing[];
  drivers: Driver[];
}
