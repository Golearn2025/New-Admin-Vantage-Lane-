/**
 * Bulk Update Users
 * 
 * Activate/Deactivate multiple users
 */

import { createClient } from '@/lib/supabase/client';

export interface BulkUpdateUsersParams {
  userIds: string[];
  isActive: boolean;
  userType: 'customer' | 'driver' | 'admin' | 'operator';
}

/**
 * Update is_active status for multiple users
 */
export async function bulkUpdateUsers({
  userIds,
  isActive,
  userType,
}: BulkUpdateUsersParams): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Determine table based on user type
  const table = getTableName(userType);

  const { error, count } = await supabase
    .from(table)
    .update({ is_active: isActive })
    .in('id', userIds);

  if (error) {
    console.error('Bulk update error:', error);
    throw new Error(`Failed to ${isActive ? 'activate' : 'deactivate'} users: ${error.message}`);
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
