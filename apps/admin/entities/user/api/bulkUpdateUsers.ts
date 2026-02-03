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
 * For drivers: also updates online_status, coordinates, status, and lifecycle events
 */
export async function bulkUpdateUsers({
  userIds,
  isActive,
  userType,
}: BulkUpdateUsersParams): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  // Determine table based on user type
  const table = getTableName(userType);

  // Build update payload based on user type
  let updatePayload: any = { is_active: isActive };

  // Special handling for drivers
  if (userType === 'driver') {
    if (isActive) {
      // Activating driver: set status to active (if approved)
      updatePayload.status = 'active';
    } else {
      // Deactivating driver: force offline and clear location
      updatePayload.online_status = 'offline';
      updatePayload.current_latitude = null;
      updatePayload.current_longitude = null;
      updatePayload.location_updated_at = null;
      updatePayload.status = 'inactive';
    }
  }

  const { error, count } = await supabase
    .from(table)
    .update(updatePayload)
    .in('id', userIds);

  if (error) {
    console.error('Bulk update error:', error);
    throw new Error(`Failed to ${isActive ? 'activate' : 'deactivate'} users: ${error.message}`);
  }

  // Record lifecycle events for drivers
  if (userType === 'driver') {
    try {
      // Get current admin user for event tracking
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get admin_users.id from auth user
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        // Insert lifecycle events for each driver
        const lifecycleEvents = userIds.map(driverId => ({
          driver_id: driverId,
          event_type: isActive ? 'activated' : 'deactivated',
          event_at: new Date().toISOString(),
          event_by: adminUser?.id || null,
          reason: isActive ? 'Bulk activation by admin' : 'Bulk deactivation by admin',
        }));

        await supabase
          .from('driver_lifecycle_events')
          .insert(lifecycleEvents);
      }
    } catch (lifecycleError) {
      console.error('Failed to record lifecycle events:', lifecycleError);
      // Don't fail the whole operation if lifecycle recording fails
    }
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
