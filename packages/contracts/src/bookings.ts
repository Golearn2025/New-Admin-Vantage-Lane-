/**
 * Bookings List API Contract
 *
 * Defines the request/response types for bookings listing endpoint.
 * These contracts are FROZEN and require ADR for modifications.
 */

export interface BookingsListRequest {
  // Filtering
  filters?: {
    status?: 'pending' | 'active' | 'completed' | 'cancelled';
    operator_id?: string;
    driver_id?: string;
    customer_id?: string;
    source?: 'app' | 'web' | 'call_center' | 'partner_api';
    date_range?: {
      start: string; // ISO 8601 format
      end: string; // ISO 8601 format
    };
    pickup_location?: string; // Location search
    destination?: string; // Destination search
  };

  // Sorting (default: created_at DESC, id DESC for keyset pagination)
  sort?: {
    field: 'created_at' | 'scheduled_at' | 'completed_at' | 'fare_amount';
    direction: 'asc' | 'desc';
  };

  // Keyset pagination (preferred for >1000 records)
  cursor?: {
    created_at: string; // ISO 8601 timestamp
    id: string; // UUID for uniqueness
  };

  // Offset pagination (for <1000 records, simpler UI)
  page?: number; // 1-indexed
  page_size?: number; // Default 25, max 100

  // Column selection (performance optimization)
  columns?: Array<
    | 'id'
    | 'status'
    | 'customer_name'
    | 'pickup_location'
    | 'destination'
    | 'scheduled_at'
    | 'created_at'
    | 'fare_amount'
    | 'driver_name'
    | 'operator_name'
    | 'source'
  >;
}

export interface BookingsListResponse {
  data: BookingListItem[];

  // Pagination metadata
  pagination: {
    total_count: number;
    page_size: number;
    has_next_page: boolean;
    has_previous_page: boolean;

    // For keyset pagination
    next_cursor?: {
      created_at: string;
      id: string;
    };

    // For offset pagination
    current_page?: number;
    total_pages?: number;
  };

  // Performance metadata
  performance: {
    query_duration_ms: number;
    cache_hit: boolean;
  };
}

export interface BookingListItem {
  id: string;
  reference: string; // CB-00XXX

  // Real workflow status
  status:
    | 'pending'
    | 'assigned'
    | 'en_route'
    | 'arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

  // Urgency flags
  is_urgent: boolean; // True if <3h until pickup and no driver assigned
  is_new: boolean; // True if created in last 24h

  // Trip info
  trip_type: 'oneway' | 'return' | 'hourly' | 'fleet';
  category: string; // EXEC, LUX, SUV, VAN
  vehicle_model: string | null; // exec_5_series, lux_s_class, etc

  // Customer
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_total_bookings: number;
  customer_loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  customer_status: 'active' | 'inactive' | 'suspended' | null;
  customer_total_spent: number; // In pounds (decimal)

  // Locations
  pickup_location: string;
  destination: string;

  // Dates
  scheduled_at: string | null; // ISO 8601, when the trip happens
  created_at: string; // ISO 8601, when booking was made

  // Trip details
  distance_miles: number | null;
  duration_min: number | null;
  hours: number | null; // For hourly bookings
  passenger_count: number | null;
  bag_count: number | null;
  flight_number: string | null;
  notes: string | null; // Customer notes/special requests

  // Return trip (if applicable)
  return_date: string | null;
  return_time: string | null;
  return_flight_number: string | null; // Return flight (if applicable)

  // Fleet (if applicable)
  fleet_executive: number | null;
  fleet_s_class: number | null;
  fleet_v_class: number | null;
  fleet_suv: number | null;

  // Pricing (all in pounds/euros as decimal, e.g., 85.50)
  fare_amount: number; // Total with extras
  base_price: number; // Transport only
  platform_fee: number; // Platform commission
  operator_net: number; // Operator net amount
  driver_payout: number; // Driver payout
  platform_commission_pct: number | null; // Percentage (e.g., 10.5)
  driver_commission_pct: number | null; // Percentage (e.g., 20.0)
  paid_services: Array<{
    service_code: string;
    unit_price: number; // In pounds/euros (decimal)
    quantity: number;
  }>;
  free_services: Array<{
    service_code: string;
    notes?: string | null; // Client preferences (e.g., 'classical', 'warm', 'chatty')
  }>; // Free services with optional preference notes
  payment_method: string; // CARD, CASH, etc
  payment_status: string; // pending, authorized, captured
  currency: string; // GBP, EUR, USD

  // Assignment
  driver_name: string | null;
  driver_id: string | null;
  driver_phone: string | null;
  driver_email: string | null;
  driver_rating: number | null; // 0-5 stars
  vehicle_id: string | null;
  vehicle_make: string | null;
  vehicle_model_name: string | null;
  vehicle_year: number | null; // Vehicle year (e.g., 2024)
  vehicle_color: string | null;
  vehicle_plate: string | null;
  assigned_at: string | null; // ISO 8601, when job was assigned
  assigned_by_name: string | null; // Admin who assigned

  // Meta
  operator_name: string | null;
  operator_rating: number | null; // Organization rating (0-5)
  operator_reviews: number | null; // Total reviews count
  source: 'app' | 'web' | 'call_center' | 'partner_api';
  
  // Legs (for RETURN and FLEET bookings)
  legs?: BookingLeg[]; // Individual journey segments
}

/**
 * Booking Leg - Individual journey segment for RETURN and FLEET bookings
 */
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

// Required database indexes for optimal performance
export const BOOKINGS_REQUIRED_INDEXES = [
  'idx_bookings_created_at_id', // (created_at DESC, id DESC) - primary sort
  'idx_bookings_status_created_at', // (status, created_at DESC) - status filter
  'idx_bookings_operator_created_at', // (operator_id, created_at DESC) - operator filter
  'idx_bookings_driver_created_at', // (driver_id, created_at DESC) - driver filter
  'idx_bookings_source_created_at', // (source, created_at DESC) - source filter
  'idx_bookings_scheduled_at', // (scheduled_at) - scheduled bookings
] as const;
