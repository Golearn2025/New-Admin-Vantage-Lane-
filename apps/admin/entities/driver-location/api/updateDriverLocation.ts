/**
 * Driver Location API - Update Driver Location
 * 
 * Updates driver's current position (called from mobile app)
 */

import { createClient } from '@/lib/supabase/server';
import type { UpdateLocationPayload } from '../model/types';

/**
 * Update driver location from mobile app
 */
export async function updateDriverLocation(
  driverId: string,
  locationData: UpdateLocationPayload
): Promise<void> {
  const supabase = createClient();
  
  const updatePayload = {
    current_latitude: locationData.latitude,
    current_longitude: locationData.longitude,
    location_accuracy: locationData.accuracy || null,
    location_updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('drivers')
    .update(updatePayload)
    .eq('id', driverId)
    .eq('is_active', true); // Only update active drivers

  if (error) {
    console.error('Error updating driver location:', error);
    throw new Error(`Failed to update driver location: ${error.message}`);
  }
}

/**
 * Update driver online status
 */
export async function updateDriverStatus(
  driverId: string,
  status: 'offline' | 'online' | 'busy' | 'break',
  location?: { latitude: number; longitude: number; accuracy?: number }
): Promise<void> {
  const supabase = createClient();
  
  const updatePayload: any = {
    online_status: status,
    last_online_at: status !== 'offline' ? new Date().toISOString() : null,
  };

  // Include location data if provided (usually when going online)
  if (location) {
    updatePayload.current_latitude = location.latitude;
    updatePayload.current_longitude = location.longitude;
    updatePayload.location_accuracy = location.accuracy || null;
    updatePayload.location_updated_at = new Date().toISOString();
  }

  // Clear location when going offline for privacy
  if (status === 'offline') {
    updatePayload.current_latitude = null;
    updatePayload.current_longitude = null;
    updatePayload.location_accuracy = null;
    updatePayload.location_updated_at = null;
  }

  const { error } = await supabase
    .from('drivers')
    .update(updatePayload)
    .eq('id', driverId)
    .eq('is_active', true);

  if (error) {
    console.error('Error updating driver status:', error);
    throw new Error(`Failed to update driver status: ${error.message}`);
  }
}
