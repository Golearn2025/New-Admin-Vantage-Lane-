/**
 * Bookings List API - Orchestration Only
 * NO business logic here - just coordination
 * Compliant: <150 lines
 */

import { logger } from '@/lib/utils/logger';
import type { BookingsListParams, BookingRowDTO } from '@entities/booking/types/bookingsList.types';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { transformRowsToResponse } from './mappers';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Create server Supabase client with cookies (proper session propagation)
    const supabase = await createClient();
    
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized access to bookings list API', { 
        error: authError?.message,
        hasUser: !!user 
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters with strict types
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const requestedPageSize = parseInt(searchParams.get('page_size') || '25', 10);
    const pageSize = requestedPageSize > 1000 ? Math.min(requestedPageSize, 10000) : Math.min(requestedPageSize, 100);
    
    // Prepare RPC parameters with strict validation
    const validSorts: BookingsListParams['sort'][] = ['created_at', 'pickup_time', 'status', 'price_total'];
    const validDirs: BookingsListParams['dir'][] = ['asc', 'desc'];
    
    const sortParam = searchParams.get('sort') || 'created_at';
    const dirParam = searchParams.get('dir') || 'desc';
    
    const rpcParams: BookingsListParams = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      sort: validSorts.includes(sortParam as BookingsListParams['sort']) 
        ? (sortParam as BookingsListParams['sort']) 
        : 'created_at',
      dir: validDirs.includes(dirParam as BookingsListParams['dir'])
        ? (dirParam as BookingsListParams['dir'])
        : 'desc',
      search: searchParams.get('search') || null,
      status: searchParams.get('status') || null,
      from: searchParams.get('from') || null,
      to: searchParams.get('to') || null,
    };

    // Add structured logging for debugging
    logger.info('Calling get_bookings_list RPC', {
      user_id: user.id,
      params: rpcParams,
      rpc_name: 'get_bookings_list'
    });

    // Call RPC function with correct parameter order
    // Function expects: p_limit, p_offset, p_sort, p_dir, p_search, p_status, p_from, p_to
    const { data, error } = await supabase.rpc('get_bookings_list', {
      p_limit: rpcParams.limit,
      p_offset: rpcParams.offset,
      p_sort: rpcParams.sort,
      p_dir: rpcParams.dir,
      p_search: rpcParams.search,
      p_status: rpcParams.status,
      p_from: rpcParams.from,
      p_to: rpcParams.to,
    });
    
    if (error) {
      logger.error('RPC get_bookings_list failed', { 
        error: error.message, 
        code: error.code,
        params: rpcParams,
        user_id: user?.id
      });
      
      // Return proper error response instead of throwing
      return NextResponse.json(
        { 
          error: `Database query failed: ${error.message}`,
          code: error.code,
          details: error.details || 'No additional details'
        }, 
        { status: 500 }
      );
    }

    const rows = (data as BookingRowDTO[]) || [];
    const total = rows.length > 0 ? (rows[0]?.total_count ?? 0) : 0;
    
    // Enhanced logging with first row sample for debugging
    logger.info('RPC get_bookings_list success - raw data sample', {
      user_id: user.id,
      total_rows: rows.length,
      total_count: total,
      first_row_sample: rows.length > 0 ? {
        booking_id: rows[0]?.booking_id,
        status: rows[0]?.status,
        customer_name: rows[0]?.customer_name,
        pickup_time: rows[0]?.pickup_time,
        price_total: rows[0]?.price_total,
        currency: rows[0]?.currency
      } : null
    });
    
    // Transform data using extracted mapper
    const response = transformRowsToResponse(rows, page, pageSize, startTime);

    logger.info('Bookings list RPC success', {
      total_rows: rows.length,
      total_count: total,
      duration_ms: Date.now() - startTime
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Unexpected error in bookings list API', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
