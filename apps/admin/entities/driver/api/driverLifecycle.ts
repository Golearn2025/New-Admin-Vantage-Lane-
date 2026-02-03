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
      is_approved: true,
      is_active: true,
    })
    .eq('id', driverId);

  if (driverError) throw driverError;

  // Record approval event in lifecycle events
  const { error: approvalError } = await supabase
    .from('driver_lifecycle_events')
    .insert({
      driver_id: driverId,
      event_type: 'approved',
      event_at: new Date().toISOString(),
      event_by: adminId,
    });

  if (approvalError) throw approvalError;

  // Record activation event in lifecycle events
  const { error: activationError } = await supabase
    .from('driver_lifecycle_events')
    .insert({
      driver_id: driverId,
      event_type: 'activated',
      event_at: new Date().toISOString(),
      event_by: adminId,
    });

  if (activationError) throw activationError;

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
  reason: string,
  adminId?: string
): Promise<void> {
  const supabase = createClient();

  // Update driver status to inactive
  const { error: driverError } = await supabase
    .from('drivers')
    .update({
      status: 'inactive',
      is_active: false,
    })
    .eq('id', driverId);

  if (driverError) throw driverError;

  // Record deactivation event in lifecycle events
  const { error: eventError } = await supabase
    .from('driver_lifecycle_events')
    .insert({
      driver_id: driverId,
      event_type: 'deactivated',
      event_at: new Date().toISOString(),
      event_by: adminId || null,
      reason: reason,
    });

  if (eventError) throw eventError;
}
