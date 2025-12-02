/**
 * Driver Lifecycle Management
 * Activation, deactivation, and vehicle service type assignments
 */

import { createClient } from '@/lib/supabase/client';
import type { VehicleServiceType } from '../model/types';

/**
 * Assign vehicle service types
 * Priority 2 migration feature
 */
export async function assignVehicleServiceTypes(
  vehicleId: string,
  serviceTypes: VehicleServiceType[],
  adminId: string
): Promise<void> {
  const supabase = createClient();

  // Delete existing service types for this vehicle
  await supabase
    .from('vehicle_service_types')
    .delete()
    .eq('vehicle_id', vehicleId);

  // Insert new service types
  const insertData = serviceTypes.map(type => ({
    vehicle_id: vehicleId,
    service_type: type,
    approved_by: adminId,
    approved_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('vehicle_service_types')
    .insert(insertData);

  if (error) throw error;
}

/**
 * Activate driver after document approval
 * Updates driver status and assigns vehicle service types
 */
export async function activateDriver(
  driverId: string,
  vehicleId: string,
  serviceTypes: VehicleServiceType[],
  adminId: string
): Promise<void> {
  const supabase = createClient();

  // Update driver status to active
  const { error: driverError } = await supabase
    .from('drivers')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      is_approved: true,
      is_active: true,
    })
    .eq('id', driverId);

  if (driverError) throw driverError;

  // Assign vehicle service types
  if (serviceTypes.length > 0) {
    await assignVehicleServiceTypes(vehicleId, serviceTypes, adminId);
  }
}

/**
 * Deactivate driver
 */
export async function deactivateDriver(
  driverId: string,
  reason: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('drivers')
    .update({
      status: 'inactive',
      deactivated_at: new Date().toISOString(),
      deactivation_reason: reason,
      is_active: false,
    })
    .eq('id', driverId);

  if (error) throw error;
}
