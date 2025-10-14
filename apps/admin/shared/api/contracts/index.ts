/**
 * API Contracts Index - FROZEN
 * 
 * All API contracts for listing endpoints.
 * These contracts are FROZEN and require ADR for modifications.
 */

// Bookings contracts
export * from './bookings';

// Users contracts
export * from './users';

// Documents contracts
export * from './documents';

// Support tickets contracts
export * from './tickets';

// Payments contracts
export * from './payments';

// Common types used across contracts
export interface PaginationMeta {
  total_count: number;
  page_size: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  current_page?: number;
  total_pages?: number;
}

export interface PerformanceMeta {
  query_duration_ms: number;
  cache_hit: boolean;
}

export interface KeysetCursor {
  [key: string]: string | number | null;
}

// Sort directions
export type SortDirection = 'asc' | 'desc';

// Common date range filter
export interface DateRangeFilter {
  start: string; // ISO 8601 format
  end: string;   // ISO 8601 format
}

// Standard list response structure
export interface StandardListResponse<T, C = KeysetCursor> {
  data: T[];
  pagination: PaginationMeta & {
    next_cursor?: C;
  };
  performance: PerformanceMeta;
}
