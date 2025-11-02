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
  notes: string | null;
  return_date: string | null;
  return_time: string | null;
  return_flight_number: string | null;
  organization_id: string | null;
  source: 'app' | 'web' | 'call_center' | 'partner_api' | null; // Booking origin
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

export interface BookingLeg {
  id: string;
  parent_booking_id: string;
  leg_number: number;
  leg_type: string; // 'outbound' | 'return' | 'vehicle'
  vehicle_category?: string | null; // For FLEET: 'EXEC', 'LUX', 'SUV', 'VAN'
  pickup_location: string;
  destination: string;
  scheduled_at: string;
  distance_miles?: number | null;
  duration_min?: number | null;
  assigned_driver_id: string | null;
  assigned_vehicle_id: string | null;
  status: string;
  leg_price: string;
  driver_payout: string | null;
}

export interface BookingPricing {
  booking_id: string;
  price: string;
  currency: string;
  payment_method: string;
  payment_status: string;
  platform_fee?: string | null;
  operator_net?: string | null;
  driver_payout?: string | null;
  platform_commission_pct?: string | null;
  driver_commission_pct?: string | null;
}

export interface BookingService {
  booking_id: string;
  service_code: string;
  unit_price: string;
  quantity: number;
  notes?: string | null; // Client preferences (e.g., 'classical', 'warm', 'chatty')
}

export interface Organization {
  id: string;
  name: string;
  rating_average: number | null;
  review_count: number | null;
}

export interface BookingAssignment {
  booking_id: string;
  assigned_at: string | null;
  assigned_by: string | null;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  rating_average: number | null;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  license_plate: string;
}

export interface QueryResult {
  bookings: RawBooking[];
  totalCount: number;
  customers: Customer[];
  segments: BookingSegment[];
  legs: BookingLeg[];
  pricing: BookingPricing[];
  services: BookingService[];
  organizations: Organization[];
  assignments: BookingAssignment[];
  drivers: Driver[];
  vehicles: Vehicle[];
}
