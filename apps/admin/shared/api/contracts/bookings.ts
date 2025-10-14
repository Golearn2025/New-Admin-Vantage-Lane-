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
      end: string;   // ISO 8601 format
    };
    pickup_location?: string; // Location search
    destination?: string;     // Destination search
  };
  
  // Sorting (default: created_at DESC, id DESC for keyset pagination)
  sort?: {
    field: 'created_at' | 'scheduled_at' | 'completed_at' | 'fare_amount';
    direction: 'asc' | 'desc';
  };
  
  // Keyset pagination (preferred for >1000 records)
  cursor?: {
    created_at: string; // ISO 8601 timestamp
    id: string;         // UUID for uniqueness
  };
  
  // Offset pagination (for <1000 records, simpler UI)
  page?: number;        // 1-indexed
  page_size?: number;   // Default 25, max 100
  
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
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  customer_name: string;
  pickup_location: string;
  destination: string;
  scheduled_at: string | null; // ISO 8601, null for immediate bookings
  created_at: string;          // ISO 8601
  fare_amount: number;         // In cents
  driver_name: string | null;
  operator_name: string;
  source: 'app' | 'web' | 'call_center' | 'partner_api';
}

// Required database indexes for optimal performance
export const BOOKINGS_REQUIRED_INDEXES = [
  'idx_bookings_created_at_id',           // (created_at DESC, id DESC) - primary sort
  'idx_bookings_status_created_at',       // (status, created_at DESC) - status filter
  'idx_bookings_operator_created_at',     // (operator_id, created_at DESC) - operator filter
  'idx_bookings_driver_created_at',       // (driver_id, created_at DESC) - driver filter
  'idx_bookings_source_created_at',       // (source, created_at DESC) - source filter
  'idx_bookings_scheduled_at',            // (scheduled_at) - scheduled bookings
] as const;
