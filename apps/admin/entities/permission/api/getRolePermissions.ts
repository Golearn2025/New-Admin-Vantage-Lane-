/**
 * Get Role Permissions API
 */

import { createClient } from '@/lib/supabase/client';
import type { UserRole, PageWithPermission, RolePermissionsResponse } from '../model/types';

export async function getRolePermissions(role: UserRole): Promise<RolePermissionsResponse> {
  const supabase = createClient();

  // Get all pages with their permissions for this role
  const { data, error } = await supabase
    .from('page_definitions')
    .select(`
      *,
      role_permissions!left(enabled)
    `)
    .eq('is_active', true)
    .eq('role_permissions.role', role)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Get role permissions error:', error);
    throw new Error(`Failed to fetch role permissions: ${error.message}`);
  }

  const pages: PageWithPermission[] = (data || []).map((d: any) => ({
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
    enabled: d.role_permissions?.[0]?.enabled ?? false,
  }));

  return {
    role,
    pages,
  };
}
