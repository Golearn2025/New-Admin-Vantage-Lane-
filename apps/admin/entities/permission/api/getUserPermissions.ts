/**
 * Get User Permissions API
 */

import { createClient } from '@/lib/supabase/client';
import type { PageWithPermission, UserPermissionsResponse } from '../model/types';

export async function getUserPermissions(userId: string): Promise<UserPermissionsResponse> {
  const supabase = createClient();

  // Get user's role first
  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  const userRole = userData?.user?.user_metadata?.role || 'operator';

  // Get all pages with role permissions and user overrides
  const { data, error } = await supabase
    .from('page_definitions')
    .select(`
      *,
      role_permissions!left(enabled),
      user_permissions!left(enabled)
    `)
    .eq('is_active', true)
    .eq('role_permissions.role', userRole)
    .eq('user_permissions.user_id', userId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Get user permissions error:', error);
    throw new Error(`Failed to fetch user permissions: ${error.message}`);
  }

  const pages: PageWithPermission[] = (data || []).map((d: any) => {
    const roleEnabled = d.role_permissions?.[0]?.enabled ?? false;
    const userOverride = d.user_permissions?.[0]?.enabled;
    const hasOverride = userOverride !== undefined;

    return {
      id: d.id,
      pageKey: d.page_key,
      label: d.label,
      icon: d.icon,
      href: d.href,
      parentKey: d.parent_key,
      displayOrder: d.display_order,
      description: d.description,
      isActive: d.is_active,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      enabled: hasOverride ? userOverride : roleEnabled,
      hasOverride,
    };
  });

  return {
    userId,
    pages,
  };
}
