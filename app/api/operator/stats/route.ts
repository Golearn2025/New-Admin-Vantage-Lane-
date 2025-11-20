/**
 * Operator Stats API
 * Returns driver statistics for the authenticated operator
 * - RBAC: Admin (sees all) + Operator (sees only their organization)
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

interface OperatorStatsResponse {
  totalDrivers: number;
  activeDrivers: number;
  pendingDrivers: number;
  totalBookings: number;
  organizationId?: string;
  organizationName?: string | null;
}

export async function GET() {
  try {
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

    // RBAC check - verify user is admin OR operator
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    // Check if user is operator if not admin
    let organizationId: string | null = null;
    let organizationName: string | null = null;
    let isAuthorized = false;

    if (adminUser && adminUser.is_active && ['super_admin', 'admin'].includes(adminUser.role)) {
      // User is admin - can see all data
      isAuthorized = true;
      organizationId = null; // null = see all organizations
    } else {
      // Check if user is operator
      const { data: operatorUser } = await supabase
        .from('user_organization_roles')
        .select(`
          organization_id, 
          role, 
          is_active,
          organizations!inner (
            name
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (operatorUser && operatorUser.role === 'admin') {
        // User is operator - can see only their organization data
        isAuthorized = true;
        organizationId = operatorUser.organization_id;
        organizationName = (operatorUser.organizations as unknown as { name: string })?.name;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Admin or Operator access required' }, { status: 403 });
    }

    // Get driver statistics
    let driversQuery = supabase
      .from('drivers')
      .select('id, is_approved, is_active, organization_id');

    // Filter by organization if operator
    if (organizationId) {
      driversQuery = driversQuery.eq('organization_id', organizationId);
    }

    const { data: drivers, error: driversError } = await driversQuery;

    if (driversError) {
      logger.error('Error fetching drivers stats', { error: driversError.message });
      return NextResponse.json({ error: 'Failed to fetch driver stats' }, { status: 500 });
    }

    // Calculate statistics
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => d.is_active).length;
    const pendingDrivers = drivers.filter(d => !d.is_approved).length;

    // Get booking count from dashboard metrics
    const { data: metricsData, error: metricsError } = await supabase.rpc('get_dashboard_metrics', {
      p_start_date: null,
      p_end_date: null,
      p_organization_id: organizationId,
    });

    if (metricsError) {
      logger.error('Error fetching booking metrics', { error: metricsError.message });
      return NextResponse.json({ error: 'Failed to fetch booking metrics' }, { status: 500 });
    }

    const totalBookings = metricsData?.total_bookings || 0;

    const stats: OperatorStatsResponse = {
      totalDrivers,
      activeDrivers,
      pendingDrivers,
      totalBookings,
      ...(organizationId && { organizationId, organizationName }),
    };

    return NextResponse.json(stats);
  } catch (error) {
    logger.error('Unexpected error in operator stats API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
