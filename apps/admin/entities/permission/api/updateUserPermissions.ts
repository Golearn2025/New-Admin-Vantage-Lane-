/**
 * Update User Permissions API
 */

import { createClient } from '@/lib/supabase/client';

export interface UpdateUserPermissionParams {
  userId: string;
  pageKey: string;
  enabled: boolean;
}

export async function updateUserPermission({
  userId,
  pageKey,
  enabled,
}: UpdateUserPermissionParams): Promise<{ success: boolean }> {
  const supabase = createClient();

  // Upsert user permission override
  const { error } = await supabase
    .from('user_permissions')
    .upsert(
      {
        user_id: userId,
        page_key: pageKey,
        enabled,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,page_key',
      }
    );

  if (error) {
    console.error('Update user permission error:', error);
    throw new Error(`Failed to update user permission: ${error.message}`);
  }

  return { success: true };
}

export async function removeUserPermissionOverride(
  userId: string,
  pageKey: string
): Promise<{ success: boolean }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('page_key', pageKey);

  if (error) {
    console.error('Remove user permission override error:', error);
    throw new Error(`Failed to remove permission override: ${error.message}`);
  }

  return { success: true };
}
