/**
 * Support Tickets List API Contract
 * 
 * Defines the request/response types for support tickets listing endpoint.
 * These contracts are FROZEN and require ADR for modifications.
 */

export interface TicketsListRequest {
  // Filtering
  filters?: {
    state?: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: 'technical' | 'billing' | 'service' | 'complaint' | 'feature_request';
    assigned_to?: string;          // Support agent ID
    customer_id?: string;          // Filter by customer
    sla_status?: 'on_time' | 'overdue' | 'breached';
    created_range?: {
      start: string;               // ISO 8601 format
      end: string;
    };
    sla_due_range?: {
      start: string;
      end: string;
    };
  };
  
  // Sorting (default: sla_due_at ASC, priority DESC, created_at DESC, id DESC)
  sort?: {
    field: 'sla_due_at' | 'priority' | 'created_at' | 'state' | 'last_updated';
    direction: 'asc' | 'desc';
  };
  
  // Keyset pagination
  cursor?: {
    sla_due_at: string | null;  // ISO 8601 timestamp or null
    priority: string;           // priority level
    created_at: string;         // ISO 8601 timestamp
    id: string;                 // UUID for uniqueness
  };
  
  // Offset pagination
  page?: number;        // 1-indexed
  page_size?: number;   // Default 25, max 100
  
  // Column selection
  columns?: Array<
    | 'id'
    | 'state'
    | 'priority'
    | 'category'
    | 'subject'
    | 'customer_name'
    | 'assigned_agent'
    | 'created_at'
    | 'sla_due_at'
    | 'last_updated'
    | 'response_count'
    | 'sla_status'
  >;
}

export interface TicketsListResponse {
  data: TicketListItem[];
  
  pagination: {
    total_count: number;
    page_size: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    
    // For keyset pagination
    next_cursor?: {
      sla_due_at: string | null;
      priority: string;
      created_at: string;
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

export interface TicketListItem {
  id: string;
  state: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'service' | 'complaint' | 'feature_request';
  subject: string;
  customer_name: string;
  assigned_agent: string | null;  // Support agent name
  created_at: string;             // ISO 8601 timestamp
  sla_due_at: string | null;      // ISO 8601 timestamp
  last_updated: string;           // ISO 8601 timestamp
  response_count: number;         // Number of responses in ticket
  sla_status: 'on_time' | 'overdue' | 'breached';
}

// Required database indexes for optimal performance
export const TICKETS_REQUIRED_INDEXES = [
  'idx_tickets_sla_priority_created_id',  // (sla_due_at ASC, priority DESC, created_at DESC, id DESC) - primary sort
  'idx_tickets_state_sla',                // (state, sla_due_at ASC) - state + SLA filter
  'idx_tickets_priority_created',         // (priority DESC, created_at DESC) - priority sort
  'idx_tickets_assigned_state',           // (assigned_to, state) - agent assignment filter
  'idx_tickets_customer_created',         // (customer_id, created_at DESC) - customer filter
  'idx_tickets_category_state',           // (category, state) - category filter
  'idx_tickets_sla_overdue',              // (sla_due_at) WHERE sla_due_at < NOW() - overdue alerts
] as const;
