/**
 * Restore Users API
 * 
 * Restore soft-deleted users by setting deleted_at to NULL
 */

import { createClient } from '@/lib/supabase/client';

export interface RestoreUsersParams {
  userIds: string[];
  userType: 'customer' | 'driver' | 'admin' | 'operator';
}

/**
 * Restore multiple users by setting deleted_at to NULL
 */
export async function restoreUsers({
  userIds,
  userType,
}: RestoreUsersParams): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Determine table based on user type
  const table = getTableName(userType);

  const { error, count } = await supabase
    .from(table)
    .update({ 
      deleted_at: null,
    })
    .in('id', userIds)
    .not('deleted_at', 'is', null); // Only restore deleted users

  if (error) {
    console.error('Restore error:', error);
    throw new Error(`Failed to restore users: ${error.message}`);
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
      return 'organizations';
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}
