/**
 * Bookings List API - Orchestration Only
 * NO business logic here - just coordination
 * Compliant: <150 lines
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/utils/logger';
import type { BookingsListResponse } from '@admin-shared/api/contracts/bookings';
import { fetchBookingsData, type QueryParams } from '@entities/booking/api';
import { NextRequest, NextResponse } from 'next/server';
import { transformBookingsData } from './transform';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const requestedPageSize = parseInt(searchParams.get('page_size') || '25', 10);
    // Support "All" option: if requesting > 1000, allow up to 10000, otherwise limit to 100
    const pageSize = requestedPageSize > 1000 ? Math.min(requestedPageSize, 10000) : Math.min(requestedPageSize, 100);
    const statusParam = searchParams.get('status');

    // Validate status parameter
    const validStatuses = ['pending', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'] as const;
    const status: QueryParams['status'] =
      statusParam && validStatuses.includes(statusParam as (typeof validStatuses)[number])
        ? (statusParam as (typeof validStatuses)[number])
        : null;

    const params: QueryParams = {
      page,
      pageSize,
      status,
    };

    const supabase = createAdminClient();

    // Fetch data
    const queryResult = await fetchBookingsData(supabase, params);

    // Transform data
    const items = transformBookingsData(queryResult);

    // Build response
    const totalPages = Math.ceil(queryResult.totalCount / pageSize);
    const response: BookingsListResponse = {
      data: items,
      pagination: {
        total_count: queryResult.totalCount,
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

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Unexpected error in bookings list API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
