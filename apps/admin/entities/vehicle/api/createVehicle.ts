/**
 * Create Vehicle API
 * Server action to create new vehicle for driver
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

interface CreateVehicleParams {
  driverId: string;
  organizationId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
}

interface CreateVehicleResult {
  success: boolean;
  vehicleId?: string;
  error?: string;
}

export async function createVehicle(params: CreateVehicleParams): Promise<CreateVehicleResult> {
  console.log('🔧 [createVehicle API] Called with params:', params);
  
  try {
    // Use service client to bypass RLS for vehicle creation
    const supabase = createServiceClient();

    const insuranceExpiry = new Date();
    insuranceExpiry.setFullYear(insuranceExpiry.getFullYear() + 1);

    const vehicleData = {
      organization_id: params.organizationId,
      driver_id: params.driverId,
      license_plate: params.licensePlate.toUpperCase(),
      make: params.make,
      model: params.model,
      year: params.year,
      color: params.color,
      category: 'pending', // Admin will set during approval
      insurance_expiry: insuranceExpiry.toISOString().split('T')[0],
      approval_status: 'pending', // Waiting for admin approval
      is_active: false, // Not active until approved
      is_available: false,
    };
    
    console.log('📝 [createVehicle API] Inserting data:', vehicleData);

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select('id')
      .single();

    if (error) {
      console.error('❌ [createVehicle API] Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('✅ [createVehicle API] Vehicle created:', vehicle);

    return {
      success: true,
      vehicleId: vehicle.id,
    };
  } catch (error) {
    console.error('❌ [createVehicle API] Catch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create vehicle',
    };
  }
}
