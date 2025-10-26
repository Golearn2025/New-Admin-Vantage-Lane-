/**
 * Update Role Permissions API
 */

import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '../model/types';

export interface UpdateRolePermissionParams {
  role: UserRole;
  pageKey: string;
  enabled: boolean;
}

export async function updateRolePermission({
  role,
  pageKey,
  enabled,
}: UpdateRolePermissionParams): Promise<{ success: boolean }> {
  const supabase = createClient();

  // Upsert permission
  const { error } = await supabase
    .from('role_permissions')
    .upsert(
      {
        role,
        page_key: pageKey,
        enabled,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'role,page_key',
      }
    );

  if (error) {
    console.error('Update role permission error:', error);
    throw new Error(`Failed to update role permission: ${error.message}`);
  }

  return { success: true };
}

export async function bulkUpdateRolePermissions(
  role: UserRole,
  permissions: Array<{ pageKey: string; enabled: boolean }>
): Promise<{ success: boolean }> {
  const supabase = createClient();

  const updates = permissions.map((p) => ({
    role,
    page_key: p.pageKey,
    enabled: p.enabled,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('role_permissions').upsert(updates, {
    onConflict: 'role,page_key',
  });

  if (error) {
    console.error('Bulk update role permissions error:', error);
    throw new Error(`Failed to bulk update role permissions: ${error.message}`);
  }

  return { success: true };
}
