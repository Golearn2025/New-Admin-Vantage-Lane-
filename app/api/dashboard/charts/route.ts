/**
 * Dashboard Charts API
 *
 * Returns chart data from Supabase function get_dashboard_charts()
 * - Cache: 5 minutes TTL
 * - RBAC: Admin/Super Admin only
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface DashboardChartsResponse {
  weekly_activity: ChartDataPoint[];
  revenue_trend: ChartDataPoint[];
  status_distribution: Array<{ name: string; value: number }>;
  operator_performance: Array<{
    x: string;
    bookings: number;
    revenue: number;
    commission: number;
  }>;
  cached: boolean;
  timestamp: string;
  cacheKey?: string;
}

// Cache configuration
const CACHE_TTL = 10 * 1000; // 10 seconds (for testing)
let cachedData: DashboardChartsResponse | null = null;
let cacheTime: number = 0;

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const grouping = searchParams.get('grouping') || 'day';

    // Create cache key based on params (will be updated with organization_id later)
    let cacheKey = `${startDate}-${endDate}-${grouping}`;

    // Check cache first
    const now = Date.now();
    if (cachedData && now - cacheTime < CACHE_TTL && cachedData.cacheKey === cacheKey) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // Create Supabase client
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
    cacheKey = `${startDate}-${endDate}-${grouping}-${organizationId || 'all'}`;

    // Check cache again with updated key
    if (cachedData && now - cacheTime < CACHE_TTL && cachedData.cacheKey === cacheKey) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // TODO: RPC function get_dashboard_charts doesn't exist in new DB yet
    // Temporarily return empty data to prevent 500 errors
    logger.warn('Dashboard charts RPC not available in new DB - returning empty data');
    
    const charts: DashboardChartsResponse = {
      weekly_activity: [],
      revenue_trend: [],
      status_distribution: [],
      operator_performance: [],
      cached: false,
      timestamp: new Date().toISOString(),
      cacheKey,
    };

    // Cache the result
    cachedData = charts;
    cacheTime = now;

    return NextResponse.json(charts);
  } catch (error) {
    logger.error('Unexpected error in dashboard charts API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
