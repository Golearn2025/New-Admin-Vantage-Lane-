/**
 * Bulk Delete Users (Soft Delete)
 * 
 * Mark multiple users as deleted without removing from database
 */

import { createClient } from '@/lib/supabase/client';

export interface BulkDeleteUsersParams {
  userIds: string[];
  userType: 'customer' | 'driver' | 'admin' | 'operator';
}

/**
 * Soft delete multiple users by setting deleted_at timestamp
 */
export async function bulkDeleteUsers({
  userIds,
  userType,
}: BulkDeleteUsersParams): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Determine table based on user type
  const table = getTableName(userType);

  const { error, count } = await supabase
    .from(table)
    .update({ 
      deleted_at: new Date().toISOString(),
      is_active: false, // Also deactivate
    })
    .in('id', userIds)
    .is('deleted_at', null); // Only delete non-deleted users

  if (error) {
    console.error('Bulk delete error:', error);
    throw new Error(`Failed to delete users: ${error.message}`);
  }

  return {
    success: true,
    count: count || 0,
  };
}

/**
 * Get table name based on user type
 */
function getTableName(userType: string): string {
  switch (userType) {
    case 'customer':
      return 'customers';
    case 'driver':
      return 'drivers';
    case 'admin':
      return 'admin_users';
    case 'operator':
      return 'operators';
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}
