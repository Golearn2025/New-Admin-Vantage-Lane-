/**
 * Hard Delete Users API
 * 
 * PERMANENTLY delete users from database AND auth.users (cannot be undone!)
 * Server Action to access admin client for auth deletion
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface HardDeleteUsersParams {
  userIds: string[];
  userType: 'customer' | 'driver' | 'admin' | 'operator';
}

/**
 * PERMANENTLY delete multiple users from database AND auth.users
 * WARNING: This cannot be undone!
 */
export async function hardDeleteUsers({
  userIds,
  userType,
}: HardDeleteUsersParams): Promise<{ success: boolean; count: number; authDeleted: number }> {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  // Determine table based on user type
  const table = getTableName(userType);

  // Note: Foreign keys are configured to handle dependencies:
  // - bookings.assigned_driver_id → SET NULL (preserves booking history)
  // - booking_legs.assigned_driver_id → SET NULL (preserves leg history)
  // - driver_documents.driver_id → CASCADE (deletes documents)
  // - vehicles.driver_id → SET NULL (unlinks vehicles)

  // STEP 1: Get auth_user_id for drivers/customers (they have auth accounts)
  let authUserIds: string[] = [];
  if (userType === 'driver' || userType === 'customer') {
    const { data: usersData } = await supabase
      .from(table)
      .select('auth_user_id')
      .in('id', userIds)
      .not('deleted_at', 'is', null); // Only already soft-deleted users

    authUserIds = (usersData || [])
      .map((u: any) => u.auth_user_id)
      .filter(Boolean); // Remove nulls
  }

  // STEP 2: Delete from main table (drivers, customers, etc.)
  const { error, count } = await supabase
    .from(table)
    .delete()
    .in('id', userIds)
    .not('deleted_at', 'is', null); // Only hard delete already soft-deleted users

  if (error) {
    console.error('Hard delete error:', error);
    throw new Error(`Failed to permanently delete users: ${error.message}`);
  }

  // STEP 3: Delete from auth.users (if applicable)
  let authDeletedCount = 0;
  if (authUserIds.length > 0) {
    for (const authUserId of authUserIds) {
      try {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
        if (!authError) {
          authDeletedCount++;
        } else {
          console.error(`Failed to delete auth user ${authUserId}:`, authError);
        }
      } catch (err) {
        console.error(`Error deleting auth user ${authUserId}:`, err);
      }
    }
  }

  return {
    success: true,
    count: count || 0,
    authDeleted: authDeletedCount,
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
