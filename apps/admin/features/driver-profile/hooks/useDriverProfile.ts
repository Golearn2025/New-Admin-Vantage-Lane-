/**
 * useDriverProfile Hook
 * 
 * Fetches complete driver profile data including organization info
 * Uses SWR for caching and automatic revalidation
 */

import useSWR from 'swr';
import type { DriverProfileData } from '@entities/driver';
import { createClient } from '@/lib/supabase/client';

interface UseDriverProfileResult {
  driver: DriverProfileData | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

/**
 * Fetch driver profile with organization data
 */
async function fetchDriverProfile(driverId: string): Promise<DriverProfileData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('drivers')
    .select(`
      id,
      email,
      first_name,
      last_name,
      phone,
      profile_photo_url,
      pco_license_number,
      pco_license_expiry,
      rating_average,
      rating_count,
      status,
      is_active,
      is_approved,
      approved_at,
      approved_by,
      rejection_reason,
      activated_at,
      deactivated_at,
      deactivation_reason,
      organization_id,
      created_at,
      updated_at
    `)
    .eq('id', driverId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch driver profile: ${error.message}`);
  }

  if (!data) {
    throw new Error('Driver not found');
  }

  // Fetch organization name separately if needed
  let organizationName: string | null = null;
  if (data.organization_id) {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', data.organization_id)
      .maybeSingle();
    
    organizationName = orgData?.name || null;
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    profileImageUrl: data.profile_photo_url,
    profilePhotoUrl: data.profile_photo_url,
    // License info is now in driver_documents table
    pcoLicenseNumber: data.pco_license_number,
    pcoLicenseExpiry: data.pco_license_expiry,
    ratingAverage: data.rating_average,
    ratingCount: data.rating_count,
    isActive: data.is_active,
    isApproved: data.is_approved,
    status: data.status || 'pending_documents',
    activatedAt: data.activated_at || null,
    deactivatedAt: data.deactivated_at || null,
    deactivationReason: data.deactivation_reason || null,
    // Approval tracking
    approvedAt: data.approved_at,
    approvedBy: data.approved_by,
    rejectionReason: data.rejection_reason,
    organizationId: data.organization_id,
    organizationName,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Hook to fetch and manage driver profile data
 */
export function useDriverProfile(driverId: string): UseDriverProfileResult {
  const { data, error, isLoading, mutate } = useSWR(
    driverId ? `driver-profile-${driverId}` : null,
    () => fetchDriverProfile(driverId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    driver: data || null,
    isLoading,
    error: error || null,
    mutate,
  };
}
