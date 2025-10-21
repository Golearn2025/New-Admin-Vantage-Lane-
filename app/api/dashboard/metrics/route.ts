/**
 * Dashboard Metrics API
 *
 * Returns aggregated metrics from Supabase function get_dashboard_metrics()
 * - Cache: 5 minutes TTL
 * - RBAC: Admin/Super Admin only
 * - Security: Uses createServerClient (RLS enforced)
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

interface DashboardMetricsResponse {
  // Row 1: Financial Overview
  total_revenue_pence: number;
  total_bookings: number;
  avg_booking_pence: number;
  platform_commission_pence: number;

  // Row 2: Operations & Future
  operator_payout_pence: number;
  cancelled_count: number;
  refunds_total_pence: number;
  scheduled_count: number;

  // Meta
  cached: boolean;
  timestamp: string;
  cacheKey?: string;
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedData: DashboardMetricsResponse | null = null;
let cacheTime: number = 0;

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Create cache key based on date range
    const cacheKey = `${startDate}-${endDate}`;

    // Check cache first (cache per date range)
    const now = Date.now();
    if (cachedData && now - cacheTime < CACHE_TTL && cachedData.cacheKey === cacheKey) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // Create Supabase client with user context (RLS enforced)
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC check - verify user is admin
    const { data: adminUser, error: rbacError } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    if (rbacError || !adminUser) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    if (!adminUser.is_active || !['super_admin', 'admin'].includes(adminUser.role)) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
    }

    // Call database function with date range
    const { data, error } = await supabase.rpc('get_dashboard_metrics', {
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
    });

    if (error) {
      logger.error('Error fetching dashboard metrics', { error: error.message });
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    // Parse and validate response
    const metrics: DashboardMetricsResponse = {
      // Row 1
      total_revenue_pence: data.total_revenue_pence || 0,
      total_bookings: data.total_bookings || 0,
      avg_booking_pence: data.avg_booking_pence || 0,
      platform_commission_pence: data.platform_commission_pence || 0,

      // Row 2
      operator_payout_pence: data.operator_payout_pence || 0,
      cancelled_count: data.cancelled_count || 0,
      refunds_total_pence: data.refunds_total_pence || 0,
      scheduled_count: data.scheduled_count || 0,

      // Meta
      cached: false,
      timestamp: new Date().toISOString(),
      cacheKey,
    };

    // Cache the result
    cachedData = metrics;
    cacheTime = now;

    return NextResponse.json(metrics);
  } catch (error) {
    logger.error('Unexpected error in dashboard metrics API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
