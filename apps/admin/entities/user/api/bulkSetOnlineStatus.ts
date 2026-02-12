/**
 * Bulk Set Online Status
 * 
 * Set online_status for multiple drivers (online/offline)
 * Does NOT change is_active or account status
 */

import { createClient } from '@/lib/supabase/client';

export interface BulkSetOnlineStatusParams {
  driverIds: string[];
  onlineStatus: 'online' | 'offline';
}

/**
 * Update online_status for multiple drivers
 * When setting offline: also clears location data
 */
export async function bulkSetOnlineStatus({
  driverIds,
  onlineStatus,
}: BulkSetOnlineStatusParams): Promise<{ success: boolean; count: number }> {
  const supabase = createClient();

  const updatePayload: Record<string, any> = {
    online_status: onlineStatus,
  };

  // When going offline, clear location
  if (onlineStatus === 'offline') {
    updatePayload.current_latitude = null;
    updatePayload.current_longitude = null;
    updatePayload.location_updated_at = null;
  }

  const { error, count } = await supabase
    .from('drivers')
    .update(updatePayload)
    .in('id', driverIds);

  if (error) {
    console.error('Bulk set online status error:', error);
    throw new Error(`Failed to set drivers ${onlineStatus}: ${error.message}`);
  }

  return {
    success: true,
    count: count || 0,
  };
}
