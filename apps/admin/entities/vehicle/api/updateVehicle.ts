/**
 * Update Vehicle Server Action
 * 
 * Updates vehicle information in database
 * MODERN & PREMIUM - Server-side action
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface UpdateVehicleParams {
  vehicleId: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  category?: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
}

export interface UpdateVehicleResult {
  success: boolean;
  error?: string;
}

/**
 * Update vehicle information
 */
export async function updateVehicle({
  vehicleId,
  ...updates
}: UpdateVehicleParams): Promise<UpdateVehicleResult> {
  try {
    const supabase = createClient();

    // Build update object with snake_case fields
    const updateData: Record<string, any> = {};
    
    if (updates.make !== undefined) updateData.make = updates.make;
    if (updates.model !== undefined) updateData.model = updates.model;
    if (updates.year !== undefined) updateData.year = updates.year;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.licensePlate !== undefined) updateData.license_plate = updates.licensePlate;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.passengerCapacity !== undefined) updateData.passenger_capacity = updates.passengerCapacity;
    if (updates.luggageCapacity !== undefined) updateData.luggage_capacity = updates.luggageCapacity;
    
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId);

    if (error) {
      console.error('Failed to update vehicle:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update vehicle',
    };
  }
}
