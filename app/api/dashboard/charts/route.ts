/**
 * Dashboard Charts API
 *
 * Returns chart data from Supabase function get_dashboard_charts()
 * - Cache: 5 minutes TTL
 * - RBAC: Admin/Super Admin only
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

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

    // RBAC check - verify user is admin OR operator (using service role to bypass RLS)
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabaseAdmin = createAdminClient();
    
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    // Check if user is operator if not admin
    let organizationId: string | null = null;
    let isAuthorized = false;

    if (adminUser && adminUser.is_active && ['super_admin', 'admin'].includes(adminUser.role)) {
      // User is admin - can see all data
      isAuthorized = true;
      organizationId = null; // null = see all organizations
    } else {
      // Check if user is operator
      const { data: operatorUser } = await supabase
        .from('user_organization_roles')
        .select('organization_id, role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (operatorUser && operatorUser.role === 'admin') {
        // User is operator - can see only their organization data
        isAuthorized = true;
        organizationId = operatorUser.organization_id;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Admin or Operator access required' }, { status: 403 });
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

    // Call database function with params and organization filtering
    const { data, error } = await supabase.rpc('get_dashboard_charts', {
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
      p_grouping: grouping,
      p_organization_id: organizationId || undefined,
    });

    if (error) {
      logger.error('Error fetching dashboard charts', { error: error.message });
      return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 });
    }

    // Parse response
    const charts: DashboardChartsResponse = {
      weekly_activity: data.weekly_activity || [],
      revenue_trend: data.revenue_trend || [],
      status_distribution: data.status_distribution || [],
      operator_performance: data.operator_performance || [],
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
