/**
 * Documents List API Contract
 * 
 * Defines the request/response types for documents listing endpoint.
 * These contracts are FROZEN and require ADR for modifications.
 */

export interface DocumentsListRequest {
  // Filtering
  filters?: {
    status?: 'pending' | 'approved' | 'rejected' | 'expired';
    document_type?: 'driving_license' | 'vehicle_registration' | 'insurance' | 'id_card' | 'tax_certificate';
    owner_type?: 'driver' | 'operator' | 'vehicle';
    owner_id?: string;             // Filter by specific owner
    expiry_range?: {
      start: string;               // ISO 8601 format
      end: string;                 // Documents expiring in range
    };
    upload_date_range?: {
      start: string;
      end: string;
    };
    requires_renewal?: boolean;    // Documents expiring within 30 days
  };
  
  // Sorting (default: expiry_date ASC, created_at DESC, id DESC)
  sort?: {
    field: 'expiry_date' | 'created_at' | 'status' | 'document_type';
    direction: 'asc' | 'desc';
  };
  
  // Keyset pagination
  cursor?: {
    expiry_date: string | null; // ISO 8601 date or null for no expiry
    created_at: string;         // ISO 8601 timestamp
    id: string;                 // UUID for uniqueness
  };
  
  // Offset pagination
  page?: number;        // 1-indexed
  page_size?: number;   // Default 25, max 100
  
  // Column selection
  columns?: Array<
    | 'id'
    | 'document_type'
    | 'status'
    | 'owner_type'
    | 'owner_name'
    | 'expiry_date'
    | 'created_at'
    | 'file_url'
    | 'verification_notes'
    | 'days_until_expiry'
  >;
}

export interface DocumentsListResponse {
  data: DocumentListItem[];
  
  pagination: {
    total_count: number;
    page_size: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    
    // For keyset pagination
    next_cursor?: {
      expiry_date: string | null;
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

export interface DocumentListItem {
  id: string;
  document_type: 'driving_license' | 'vehicle_registration' | 'insurance' | 'id_card' | 'tax_certificate';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  owner_type: 'driver' | 'operator' | 'vehicle';
  owner_name: string;            // Name of document owner
  expiry_date: string | null;    // ISO 8601 date, null for no expiry
  created_at: string;            // ISO 8601 timestamp
  file_url: string;              // Secure URL to document file
  verification_notes: string | null; // Admin notes on verification
  days_until_expiry: number | null;  // Calculated field, null if no expiry
}

// Required database indexes for optimal performance
export const DOCUMENTS_REQUIRED_INDEXES = [
  'idx_documents_expiry_created_id',      // (expiry_date ASC, created_at DESC, id DESC) - primary sort
  'idx_documents_status_expiry',          // (status, expiry_date ASC) - status + expiry filter
  'idx_documents_type_status',            // (document_type, status) - type filter
  'idx_documents_owner_type_id',          // (owner_type, owner_id) - owner filter
  'idx_documents_created_at_id',          // (created_at DESC, id DESC) - date sort
  'idx_documents_expiry_renewal',         // (expiry_date) WHERE expiry_date < NOW() + 30 days - renewal alerts
] as const;
