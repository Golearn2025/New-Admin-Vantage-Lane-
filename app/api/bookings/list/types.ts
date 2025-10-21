/**
 * Bookings List API - Types
 * Compliant: <150 lines
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
  trip_type: string;
  category: string | null;
  vehicle_model: string | null;
  start_at: string | null;
  created_at: string;
  flight_number: string | null;
  customer_id: string;
  assigned_driver_id: string | null;
  assigned_vehicle_id: string | null;
  distance_miles: string | null;
  duration_min: number | null;
  hours: number | null;
  passenger_count: number | null;
  bag_count: number | null;
  return_date: string | null;
  return_time: string | null;
  fleet_executive: number | null;
  fleet_s_class: number | null;
  fleet_v_class: number | null;
  fleet_suv: number | null;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  total_rides: number;
  loyalty_tier: string | null;
  status: string | null;
  total_spent: number | null;
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
  currency: string;
  payment_method: string;
  payment_status: string;
}

export interface BookingService {
  booking_id: string;
  service_code: string;
  unit_price: string;
  quantity: number;
}

export interface QueryResult {
  bookings: RawBooking[];
  totalCount: number;
  customers: Customer[];
  segments: BookingSegment[];
  pricing: BookingPricing[];
  services: BookingService[];
}
