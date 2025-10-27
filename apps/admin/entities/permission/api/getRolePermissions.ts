/**
 * Get Role Permissions API
 */

import { createClient } from '@/lib/supabase/client';
import type { UserRole, PageWithPermission, RolePermissionsResponse } from '../model/types';

export async function getRolePermissions(role: UserRole): Promise<RolePermissionsResponse> {
  const supabase = createClient();

  // Get ALL pages (not filtered by role)
  const { data: pagesData, error: pagesError } = await supabase
    .from('page_definitions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (pagesError) {
    console.error('Get pages error:', pagesError);
    throw new Error(`Failed to fetch pages: ${pagesError.message}`);
  }

  // Get permissions for this specific role
  const { data: permsData, error: permsError } = await supabase
    .from('role_permissions')
    .select('page_key, enabled')
    .eq('role', role);

  if (permsError) {
    console.error('Get permissions error:', permsError);
    throw new Error(`Failed to fetch permissions: ${permsError.message}`);
  }

  // Create a map of permissions
  const permsMap = new Map(
    (permsData || []).map((p: any) => [p.page_key, p.enabled])
  );

  // Combine pages with their permissions
  const pages: PageWithPermission[] = (pagesData || []).map((d: any) => ({
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
    enabled: permsMap.get(d.page_key) ?? false, // Default to false if no permission set
  }));

  return {
    role,
    pages,
  };
}
