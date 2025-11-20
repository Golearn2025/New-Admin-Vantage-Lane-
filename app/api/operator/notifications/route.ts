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

    // RBAC check - verify user is admin OR operator
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();

    // Check if user is operator if not admin
    let organizationId: string | null = null;
    let isAuthorized = false;

    if (adminUser && adminUser.is_active && ['super_admin', 'admin'].includes(adminUser.role)) {
      // User is admin - can see all notifications
      isAuthorized = true;
      organizationId = null; // null = see all
    } else {
      // Check if user is operator
      const { data: operatorUser } = await supabase
        .from('user_organization_roles')
        .select('organization_id, role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (operatorUser && operatorUser.role === 'admin') {
        // User is operator - can see only their notifications
        isAuthorized = true;
        organizationId = operatorUser.organization_id;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden - Admin or Operator access required' }, { status: 403 });
    }

    // Build notification query
    let notificationsQuery = supabase
      .from('notifications')
      .select('id, type, title, message, created_at, read_at, user_id, organization_id, target_type')
      .order('created_at', { ascending: false })
      .limit(10);

    // Filter notifications for operator
    if (organizationId) {
      // For operators, show notifications that are:
      // 1. Directed to them specifically (user_id = their user id)
      // 2. Directed to their organization (organization_id = their org id)  
      // 3. General operator notifications (target_type = 'operator')
      notificationsQuery = notificationsQuery.or(
        `user_id.eq.${user.id},organization_id.eq.${organizationId},and(target_type.eq.operator,user_id.is.null)`
      );
    }

    const { data: notifications, error: notificationsError } = await notificationsQuery;

    if (notificationsError) {
      logger.error('Error fetching notifications', { error: notificationsError.message });
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    // Map to response format
    const operatorNotifications: OperatorNotification[] = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      createdAt: notification.created_at,
      readAt: notification.read_at,
      organizationId: notification.organization_id,
    }));

    return NextResponse.json(operatorNotifications);
  } catch (error) {
    logger.error('Unexpected error in operator notifications API', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
