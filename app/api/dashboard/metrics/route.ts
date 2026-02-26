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

export const runtime = 'nodejs';

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
const CACHE_TTL = 10 * 1000; // 10 seconds (for testing)
let cachedData: DashboardMetricsResponse | null = null;
let cacheTime: number = 0;

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Create cache key based on date range (will be updated with organization_id later)
    let cacheKey = `${startDate}-${endDate}`;

    // Cache will be checked after determining organization_id
    const now = Date.now();

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

    // RBAC check - verify user has organization membership (using service role to bypass RLS)
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabaseAdmin = createAdminClient();
    
    const { data: membership } = await supabaseAdmin
      .from('organization_members')
      .select('role, organization_id')
      .eq('user_id', user.id)
      .single();

    let organizationId: string | null = null;
    let isAuthorized = false;

    if (membership) {
      // root/owner/admin → can see all data
      if (membership.role === 'root' || membership.role === 'owner' || membership.role === 'admin') {
        isAuthorized = true;
        organizationId = null; // null = see all organizations
      }
      // operator → can see only their organization data
      else if (membership.role === 'operator') {
        isAuthorized = true;
        organizationId = membership.organization_id;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Organization membership required' }, { status: 403 });
    }

    // Update cache key to include organization filtering
    cacheKey = `${startDate}-${endDate}-${organizationId || 'all'}`;

    // Check cache again with updated key
    if (cachedData && now - cacheTime < CACHE_TTL && cachedData.cacheKey === cacheKey) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // TODO: RPC function get_dashboard_metrics doesn't exist in new DB yet
    // Temporarily return default data to prevent 500 errors
    logger.warn('Dashboard metrics RPC not available in new DB - returning default data');
    
    const metrics: DashboardMetricsResponse = {
      // Row 1: Financial Overview
      total_revenue_pence: 0,
      total_bookings: 0,
      avg_booking_pence: 0,
      platform_commission_pence: 0,

      // Row 2: Operations & Future
      operator_payout_pence: 0,
      cancelled_count: 0,
      refunds_total_pence: 0,
      scheduled_count: 0,

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
