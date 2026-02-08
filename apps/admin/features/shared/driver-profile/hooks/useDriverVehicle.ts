/**
 * useDriverVehicle Hook
 * 
 * Fetches vehicle data associated with driver
 */

import { createClient } from '@/lib/supabase/client';
import type { VehicleData } from '@entities/driver';
import useSWR from 'swr';

interface UseDriverVehicleResult {
  vehicles: VehicleData[]; // Changed to array to support multiple vehicles
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

/**
 * Fetch all vehicles for driver (supports multiple vehicles per driver)
 */
async function fetchDriverVehicles(driverId: string): Promise<VehicleData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, organization_id, driver_id, category, make, model, year, color, license_plate, insurance_expiry, mot_expiry, passenger_capacity, luggage_capacity, is_active, is_available, approval_status, rejection_reason, approved_by, approved_at, created_at, updated_at')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false }); // Removed .single() to support multiple vehicles

  if (error) {
    throw new Error(`Failed to fetch vehicles: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((vehicle) => ({
    id: vehicle.id,
    organizationId: vehicle.organization_id,
    driverId: vehicle.driver_id,
    category: vehicle.category,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    licensePlate: vehicle.license_plate,
    insuranceExpiry: vehicle.insurance_expiry,
    motExpiry: vehicle.mot_expiry,
    passengerCapacity: vehicle.passenger_capacity,
    luggageCapacity: vehicle.luggage_capacity,
    isActive: vehicle.is_active,
    isAvailable: vehicle.is_available,
    approvalStatus: vehicle.approval_status,
    rejectionReason: vehicle.rejection_reason,
    approvedBy: vehicle.approved_by,
    approvedAt: vehicle.approved_at,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at,
  }));
}

/**
 * Hook to fetch and manage driver vehicle data
 */
export function useDriverVehicle(driverId: string): UseDriverVehicleResult {
  const { data, error, isLoading, mutate } = useSWR(
    driverId ? `driver-vehicles-${driverId}` : null,
    () => fetchDriverVehicles(driverId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    vehicles: data || [], // Return empty array instead of null
    isLoading,
    error: error || null,
    mutate,
  };
}
