/**
 * Delete Vehicle Server Action
 * 
 * Deletes vehicle from database
 * MODERN & PREMIUM - Server-side action
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface DeleteVehicleParams {
  vehicleId: string;
}

export interface DeleteVehicleResult {
  success: boolean;
  error?: string;
}

/**
 * Delete vehicle from database
 * Also deletes associated vehicle_documents via CASCADE
 */
export async function deleteVehicle({
  vehicleId,
}: DeleteVehicleParams): Promise<DeleteVehicleResult> {
  try {
    const supabase = createClient();

    // Delete vehicle (CASCADE will delete vehicle_documents automatically)
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      console.error('Failed to delete vehicle:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete vehicle',
    };
  }
}
