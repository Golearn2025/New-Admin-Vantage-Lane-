/**
 * Operator Notifications API
 * Returns recent notifications for the authenticated operator
 * - RBAC: Admin (sees all) + Operator (sees only their notifications)
 */

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import { NextResponse } from 'next/server';

interface OperatorNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
  organizationId?: string | null;
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
      // root/owner/admin → can see all notifications
      if (membership.role === 'root' || membership.role === 'owner' || membership.role === 'admin') {
        isAuthorized = true;
        organizationId = null; // null = see all
      }
      // operator → can see only their notifications
      else if (membership.role === 'operator') {
        isAuthorized = true;
        organizationId = membership.organization_id;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Organization membership required' }, { status: 403 });
    }

    // TODO: Table 'notifications' doesn't exist in new DB yet
    // Temporarily return empty array to prevent 500 errors
    logger.warn('Notifications table not available in new DB - returning empty data');
    
    const operatorNotifications: OperatorNotification[] = [];

    return NextResponse.json(operatorNotifications);
  } catch (error) {
    logger.error('Unexpected error in operator notifications API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
