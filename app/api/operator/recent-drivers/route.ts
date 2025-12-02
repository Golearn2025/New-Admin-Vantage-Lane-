/**
 * Operator Recent Drivers API
 * Returns recent drivers for the authenticated operator
 * - RBAC: Admin (sees all) + Operator (sees only their organization)  
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

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

    // Get recent drivers
    let driversQuery = supabase
      .from('drivers')
      .select('id, first_name, last_name, email, phone, is_approved, is_active, created_at, organization_id')
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
      status: driver.is_approved && driver.is_active 
        ? 'active' 
        : !driver.is_approved 
        ? 'pending' 
        : 'inactive',
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
