/**
 * Users List API Contract
 *
 * Defines the request/response types for users listing endpoint.
 * These contracts are FROZEN and require ADR for modifications.
 */

export interface UsersListRequest {
  // Filtering
  filters?: {
    role?: 'admin' | 'operator' | 'driver' | 'customer' | 'auditor';
    status?: 'active' | 'inactive' | 'suspended' | 'pending_verification';
    q?: string; // Search query (name, email, phone)
    last_login_range?: {
      start: string; // ISO 8601 format
      end: string; // ISO 8601 format
    };
    created_range?: {
      start: string;
      end: string;
    };
    verification_status?: 'verified' | 'pending' | 'failed';
    location?: string; // Geographic filter
  };

  // Sorting (default: role ASC, status ASC, last_login DESC, id DESC)
  sort?: {
    field: 'role' | 'status' | 'last_login' | 'created_at' | 'name';
    direction: 'asc' | 'desc';
  };

  // Keyset pagination (optimized for role+status+last_login index)
  cursor?: {
    role: string;
    status: string;
    last_login: string | null; // ISO 8601 timestamp or null
    id: string; // UUID for uniqueness
  };

  // Offset pagination
  page?: number; // 1-indexed
  page_size?: number; // Default 25, max 100

  // Column selection
  columns?: Array<
    | 'id'
    | 'role'
    | 'status'
    | 'name'
    | 'email'
    | 'phone'
    | 'last_login'
    | 'created_at'
    | 'verification_status'
    | 'location'
    | 'ride_count'
    | 'rating'
  >;
}

export interface UsersListResponse {
  data: UserListItem[];

  pagination: {
    total_count: number;
    page_size: number;
    has_next_page: boolean;
    has_previous_page: boolean;

    // For keyset pagination
    next_cursor?: {
      role: string;
      status: string;
      last_login: string | null;
      id: string;
    };

    // For offset pagination
    current_page?: number;
    total_pages?: number;
  };

  performance: {
    query_duration_ms: number;
    cache_hit: boolean;
  };
}

export interface UserListItem {
  id: string;
  role: 'admin' | 'operator' | 'driver' | 'customer' | 'auditor';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  name: string;
  email: string;
  phone: string | null;
  last_login: string | null; // ISO 8601 timestamp
  created_at: string; // ISO 8601
  verification_status: 'verified' | 'pending' | 'failed';
  location: string | null; // Last known location
  ride_count: number; // Total rides (for customers/drivers)
  rating: number | null; // Average rating (1-5 scale)
}

// Required database indexes for optimal performance
export const USERS_REQUIRED_INDEXES = [
  'idx_users_role_status_last_login_id', // (role, status, last_login DESC, id DESC) - primary sort
  'idx_users_status_created_at', // (status, created_at DESC) - status filter
  'idx_users_created_at_id', // (created_at DESC, id DESC) - date sort
  'idx_users_email_unique', // (email) UNIQUE - email lookup
  'idx_users_phone', // (phone) - phone lookup
  'idx_users_search_text', // GIN index for full-text search on name/email
] as const;
