/**
 * Operator Recent Drivers API
 * Returns recent drivers for the authenticated operator
 * - RBAC: Admin (sees all) + Operator (sees only their organization)  
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';


interface RecentDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
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

    // Get recent drivers
    let driversQuery = supabase
      .from('drivers')
      .select('id, first_name, last_name, email, phone, status, created_at, organization_id')
      .order('created_at', { ascending: false })
      .limit(5);

    // Filter by organization if operator
    if (organizationId) {
      driversQuery = driversQuery.eq('organization_id', organizationId);
    }

    const { data: drivers, error: driversError } = await driversQuery;

    if (driversError) {
      logger.error('Error fetching recent drivers', { error: driversError.message });
      return NextResponse.json({ error: 'Failed to fetch recent drivers' }, { status: 500 });
    }

    // Map to response format
    const recentDrivers: RecentDriver[] = drivers.map(driver => ({
      id: driver.id,
      firstName: driver.first_name,
      lastName: driver.last_name,
      email: driver.email,
      phone: driver.phone,
      status: driver.status as 'active' | 'pending' | 'inactive',
      createdAt: driver.created_at,
    }));

    return NextResponse.json(recentDrivers);
  } catch (error) {
    logger.error('Unexpected error in recent drivers API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
