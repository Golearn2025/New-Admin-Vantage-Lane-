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
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedData: DashboardChartsResponse | null = null;
let cacheTime: number = 0;

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const grouping = searchParams.get('grouping') || 'day';
    
    // Create cache key based on params
    const cacheKey = `${startDate}-${endDate}-${grouping}`;
    
    // Check cache first
    const now = Date.now();
    if (cachedData && (now - cacheTime) < CACHE_TTL && cachedData.cacheKey === cacheKey) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // Create Supabase client
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // RBAC check
    const { data: adminUser, error: rbacError } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    if (rbacError || !adminUser || !adminUser.is_active || 
        !['super_admin', 'admin'].includes(adminUser.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Call database function with params
    const { data, error } = await supabase.rpc('get_dashboard_charts', {
      p_start_date: startDate || undefined,
      p_end_date: endDate || undefined,
      p_grouping: grouping,
    });

    if (error) {
      logger.error('Error fetching dashboard charts', { error: error.message });
      return NextResponse.json(
        { error: 'Failed to fetch charts' },
        { status: 500 }
      );
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
    logger.error('Unexpected error in dashboard charts API', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
