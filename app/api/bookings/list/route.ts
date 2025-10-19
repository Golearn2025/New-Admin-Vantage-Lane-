/**
 * Bookings List API Route
 * 
 * GET /api/bookings/list
 * Returns paginated list of bookings with filters
 * Uses Supabase RLS for security
 * 
 * Refactored: Split into modules for maintainability
 * - types.ts: Type definitions
 * - query-builder.ts: Database queries
 * - transform.ts: Data transformation
 * - route.ts: Orchestration (this file)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import type { BookingsListResponse } from '@admin/shared/api/contracts/bookings';
import type { QueryParams } from './types';
import { fetchBookingsData } from './query-builder';
import { transformBookingsData } from './transform';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse query parameters
    const params = parseQueryParams(request);
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Fetch all data from database
    const queryResult = await fetchBookingsData(supabase, params);
    
    // Transform to API response format
    const items = transformBookingsData(queryResult);
    
    // Build response with pagination
    const response = buildResponse(items, queryResult.totalCount, params, startTime);
    
    return NextResponse.json(response);
    
  } catch (error) {
    logger.error('Unexpected error in bookings list API', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Parse and validate query parameters
 */
function parseQueryParams(request: NextRequest): QueryParams {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = Math.min(parseInt(searchParams.get('page_size') || '25', 10), 100);
  const statusParam = searchParams.get('status');
  const status = statusParam as 'pending' | 'active' | 'completed' | 'cancelled' | null;
  
  return { page, pageSize, status };
}

/**
 * Build final API response with pagination metadata
 */
function buildResponse(
  items: BookingsListResponse['data'],
  totalCount: number,
  params: QueryParams,
  startTime: number
): BookingsListResponse {
  const { page, pageSize } = params;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    data: items,
    pagination: {
      total_count: totalCount,
      page_size: pageSize,
      has_next_page: page < totalPages,
      has_previous_page: page > 1,
      current_page: page,
      total_pages: totalPages,
    },
    performance: {
      query_duration_ms: Date.now() - startTime,
      cache_hit: false,
    },
  };
}
