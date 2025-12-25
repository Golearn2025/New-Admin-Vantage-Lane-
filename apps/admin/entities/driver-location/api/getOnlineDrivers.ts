/**
 * Driver Location API - Get Online Drivers
 * 
 * Fetches all currently online drivers with their locations
 */

import { createClient } from '@/lib/supabase/server';
import type { DriverLocationData, OnlineDriversResponse } from '../model/types';

interface GetOnlineDriversOptions {
  organizationId?: string | undefined;  // Filter by organization (for operators)
  includeOffline?: boolean; // Include offline drivers in response
  limit?: number;          // Max number of drivers to return
}

/**
 * Get online drivers with current locations
 */
export async function getOnlineDrivers(
  options: GetOnlineDriversOptions = {}
): Promise<OnlineDriversResponse> {
  const supabase = createClient();
  const { organizationId, includeOffline = false, limit = 50 } = options;

  // Build query with filters
  let query = supabase
    .from('drivers')
    .select(`
      id,
      email,
      first_name,
      last_name, 
      profile_photo_url,
      online_status,
      current_latitude,
      current_longitude,
      location_updated_at,
      location_accuracy,
      last_online_at,
      organization_id,
      organizations!inner(name)
    `)
    .eq('is_active', true) // Only active drivers
    .limit(limit)
    .order('last_online_at', { ascending: false, nullsFirst: false });

  // Apply status filter
  if (!includeOffline) {
    query = query.neq('online_status', 'offline');
  }

  // Apply organization filter for operators
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching online drivers:', error);
    throw new Error(`Failed to fetch online drivers: ${error.message}`);
  }

  // Transform to expected format
  const drivers: DriverLocationData[] = (data || []).map(driver => ({
    id: driver.id,
    email: driver.email,
    firstName: driver.first_name,
    lastName: driver.last_name,
    profilePhotoUrl: driver.profile_photo_url,
    onlineStatus: driver.online_status as any,
    currentLatitude: driver.current_latitude,
    currentLongitude: driver.current_longitude,
    locationUpdatedAt: driver.location_updated_at,
    locationAccuracy: driver.location_accuracy,
    lastOnlineAt: driver.last_online_at,
    organizationId: driver.organization_id,
    organizationName: (driver.organizations as any)?.name || null,
  }));

  // Calculate counts
  const onlineCount = drivers.filter(d => d.onlineStatus === 'online').length;
  const busyCount = drivers.filter(d => d.onlineStatus === 'busy').length;

  return {
    drivers,
    totalCount: drivers.length,
    onlineCount,
    busyCount,
    lastUpdated: new Date().toISOString(),
  };
}
