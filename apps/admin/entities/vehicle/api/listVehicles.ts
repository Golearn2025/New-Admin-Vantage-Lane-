/**
 * List Vehicles API
 * Server action to list vehicles for driver
 */

'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Driver-facing vehicle type (simplified)
 * For use in driver UI components
 */
export interface DriverVehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  category: string;
  isActive: boolean;
  approvalStatus?: string;
  insuranceExpiry: string;
  motExpiry?: string;
}

interface ListVehiclesParams {
  driverId: string;
}

export async function listVehicles(params: ListVehiclesParams): Promise<DriverVehicle[]> {
  console.log('📝 [listVehicles API] Called for driverId:', params.driverId);
  
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', params.driverId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [listVehicles API] Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('✅ [listVehicles API] Found', data?.length || 0, 'vehicles');
    console.log('📊 [listVehicles API] Raw data:', data);

    return (data || []).map((v) => ({
      id: v.id,
      licensePlate: v.license_plate,
      make: v.make,
      model: v.model,
      year: v.year,
      color: v.color,
      category: v.category,
      isActive: v.is_active || false,
      approvalStatus: v.approval_status || 'pending',
      insuranceExpiry: v.insurance_expiry,
      motExpiry: v.mot_expiry,
    }));
  } catch (error) {
    console.error('❌ [listVehicles API] Failed to list vehicles:', error);
    return [];
  }
}
