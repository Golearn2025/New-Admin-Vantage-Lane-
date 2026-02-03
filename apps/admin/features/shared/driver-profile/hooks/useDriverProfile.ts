/**
 * useDriverProfile Hook
 * 
 * Fetches complete driver profile data including organization info
 * Uses SWR for caching and automatic revalidation
 */

import { createClient } from '@/lib/supabase/client';
import type { DriverProfileData } from '@entities/driver';
import useSWR from 'swr';

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
      rating_average,
      rating_count,
      status,
      is_active,
      is_approved,
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

  // Fetch PCO license info from driver_documents table
  let pcoLicenseNumber: string | null = null;
  let pcoLicenseExpiry: string | null = null;
  
  const { data: pcoDoc } = await supabase
    .from('driver_documents')
    .select('metadata, expiry_date')
    .eq('driver_id', driverId)
    .eq('document_type', 'pco_licence')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (pcoDoc) {
    // Extract license number from metadata if available
    pcoLicenseNumber = pcoDoc.metadata?.license_number || null;
    pcoLicenseExpiry = pcoDoc.expiry_date || null;
  }

  // Fetch lifecycle events (approval, activation, deactivation)
  const { data: lifecycleEvents } = await supabase
    .from('driver_lifecycle_events')
    .select('event_type, event_at, event_by, reason')
    .eq('driver_id', driverId)
    .order('event_at', { ascending: false });

  // Extract latest events by type
  const approvedEvent = lifecycleEvents?.find(e => e.event_type === 'approved');
  const activatedEvent = lifecycleEvents?.find(e => e.event_type === 'activated');
  const deactivatedEvent = lifecycleEvents?.find(e => e.event_type === 'deactivated');
  const rejectedEvent = lifecycleEvents?.find(e => e.event_type === 'rejected');

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    profileImageUrl: data.profile_photo_url,
    profilePhotoUrl: data.profile_photo_url,
    // License info from driver_documents table
    pcoLicenseNumber,
    pcoLicenseExpiry,
    ratingAverage: data.rating_average,
    ratingCount: data.rating_count,
    isActive: data.is_active,
    isApproved: data.is_approved,
    status: data.status || 'pending_documents',
    activatedAt: activatedEvent?.event_at || null,
    deactivatedAt: deactivatedEvent?.event_at || null,
    deactivationReason: deactivatedEvent?.reason || null,
    // Approval tracking from lifecycle events
    approvedAt: approvedEvent?.event_at || null,
    approvedBy: approvedEvent?.event_by || null,
    rejectionReason: rejectedEvent?.reason || null,
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
