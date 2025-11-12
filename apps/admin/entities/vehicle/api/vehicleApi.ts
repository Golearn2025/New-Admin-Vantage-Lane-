/**
 * Vehicle API
 * Business logic for vehicle operations
 * Zero any types - TypeScript strict
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { Vehicle, VehicleFormData, VehicleApprovalData } from '../types';

/**
 * Get vehicle for driver
 */
export async function getDriverVehicle(driverId: string): Promise<Vehicle | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', driverId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }
    
    return data as Vehicle;
  } catch (error) {
    console.error('getDriverVehicle error:', error);
    throw error;
  }
}

/**
 * Create vehicle (driver side - pending approval)
 */
export async function createVehicle(
  driverId: string,
  data: VehicleFormData
): Promise<Vehicle> {
  try {
    const supabase = createClient();
    
    const vehicleData = {
      driver_id: driverId,
      organization_id: '00000000-0000-0000-0000-000000000000', // TODO: Get from session
      license_plate: data.licensePlate,
      make: data.make,
      model: data.model,
      year: data.year,
      color: data.color,
      category: 'pending', // Will be set by admin
      approval_status: 'pending',
      insurance_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      is_active: false,
      is_available: false,
    };
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
    
    return vehicle as Vehicle;
  } catch (error) {
    console.error('createVehicle error:', error);
    throw error;
  }
}

/**
 * Approve vehicle (admin side)
 */
export async function approveVehicle(
  vehicleId: string,
  adminId: string,
  data: VehicleApprovalData
): Promise<Vehicle> {
  try {
    const supabase = createClient();
    
    const updateData = {
      category: data.category,
      passenger_capacity: data.passengerCapacity,
      luggage_capacity: data.luggageCapacity,
      approval_status: 'approved',
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      is_active: true,
      is_available: true,
      rejection_reason: null,
    };
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to approve vehicle: ${error.message}`);
    }
    
    return vehicle as Vehicle;
  } catch (error) {
    console.error('approveVehicle error:', error);
    throw error;
  }
}

/**
 * Reject vehicle (admin side)
 */
export async function rejectVehicle(
  vehicleId: string,
  adminId: string,
  reason: string
): Promise<Vehicle> {
  try {
    const supabase = createClient();
    
    const updateData = {
      approval_status: 'rejected',
      rejection_reason: reason,
      approved_by: adminId,
      approved_at: new Date().toISOString(),
      is_active: false,
    };
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to reject vehicle: ${error.message}`);
    }
    
    return vehicle as Vehicle;
  } catch (error) {
    console.error('rejectVehicle error:', error);
    throw error;
  }
}
