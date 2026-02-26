/**
 * Operator Stats API
 * Returns driver statistics for the authenticated operator
 * - RBAC: Admin (sees all) + Operator (sees only their organization)
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';


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

    // RBAC check - verify user has organization membership (using service role to bypass RLS)
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabaseAdmin = createAdminClient();
    
    const { data: membership } = await supabaseAdmin
      .from('organization_members')
      .select(`
        role,
        organization_id,
        organizations!inner (
          name
        )
      `)
      .eq('user_id', user.id)
      .single();

    let organizationId: string | null = null;
    let organizationName: string | null = null;
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
        organizationName = (membership.organizations as unknown as { name: string })?.name;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Organization membership required' }, { status: 403 });
    }

    // Get driver statistics
    let driversQuery = supabase
      .from('drivers')
      .select('id, status, organization_id');

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
    const activeDrivers = drivers.filter(d => d.status === 'active').length;
    const pendingDrivers = drivers.filter(d => d.status === 'pending').length;

    // Get booking count directly from bookings table
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq(organizationId ? 'organization_id' : 'id', organizationId || organizationId);

    const stats: OperatorStatsResponse = {
      totalDrivers,
      activeDrivers,
      pendingDrivers,
      totalBookings: totalBookings || 0,
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
