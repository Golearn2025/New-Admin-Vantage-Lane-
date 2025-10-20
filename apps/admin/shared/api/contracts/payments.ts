/**
 * Payments List API Contract
 *
 * Defines the request/response types for payments listing endpoint.
 * These contracts are FROZEN and require ADR for modifications.
 */

export interface PaymentsListRequest {
  // Filtering
  filters?: {
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    payment_method?: 'card' | 'cash' | 'wallet' | 'bank_transfer' | 'corporate_account';
    amount_range?: {
      min: number; // Amount in cents
      max: number; // Amount in cents
    };
    created_range?: {
      start: string; // ISO 8601 format
      end: string;
    };
    customer_id?: string; // Filter by customer
    booking_id?: string; // Filter by specific booking
    gateway?: 'stripe' | 'paypal' | 'local_bank' | 'cash';
    currency?: 'USD' | 'EUR' | 'RON'; // Multi-currency support
    requires_refund?: boolean; // Payments that need refunding
  };

  // Sorting (default: created_at DESC, id DESC)
  sort?: {
    field: 'created_at' | 'amount' | 'status' | 'payment_method';
    direction: 'asc' | 'desc';
  };

  // Keyset pagination
  cursor?: {
    created_at: string; // ISO 8601 timestamp
    id: string; // UUID for uniqueness
  };

  // Offset pagination
  page?: number; // 1-indexed
  page_size?: number; // Default 25, max 100

  // Column selection
  columns?: Array<
    | 'id'
    | 'status'
    | 'amount'
    | 'currency'
    | 'payment_method'
    | 'customer_name'
    | 'booking_id'
    | 'created_at'
    | 'gateway'
    | 'transaction_id'
    | 'fees'
    | 'net_amount'
  >;
}

export interface PaymentsListResponse {
  data: PaymentListItem[];

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

  // Financial summary for current filter
  summary: {
    total_amount: number; // Sum of all amounts in cents
    completed_amount: number; // Sum of completed payments
    pending_amount: number; // Sum of pending payments
    refunded_amount: number; // Sum of refunded payments
    currency: string; // Primary currency for summary
  };

  performance: {
    query_duration_ms: number;
    cache_hit: boolean;
  };
}

export interface PaymentListItem {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount: number; // Amount in cents
  currency: 'USD' | 'EUR' | 'RON';
  payment_method: 'card' | 'cash' | 'wallet' | 'bank_transfer' | 'corporate_account';
  customer_name: string;
  booking_id: string | null; // Associated booking ID
  created_at: string; // ISO 8601 timestamp
  gateway: 'stripe' | 'paypal' | 'local_bank' | 'cash';
  transaction_id: string | null; // External transaction ID
  fees: number; // Gateway fees in cents
  net_amount: number; // Amount minus fees in cents
}

// Required database indexes for optimal performance
export const PAYMENTS_REQUIRED_INDEXES = [
  'idx_payments_created_at_id', // (created_at DESC, id DESC) - primary sort
  'idx_payments_status_created', // (status, created_at DESC) - status filter
  'idx_payments_amount_created', // (amount DESC, created_at DESC) - amount sort
  'idx_payments_customer_created', // (customer_id, created_at DESC) - customer filter
  'idx_payments_booking_id', // (booking_id) - booking lookup
  'idx_payments_gateway_status', // (gateway, status) - gateway filter
  'idx_payments_method_created', // (payment_method, created_at DESC) - method filter
  'idx_payments_currency_status', // (currency, status) - currency filter
] as const;
