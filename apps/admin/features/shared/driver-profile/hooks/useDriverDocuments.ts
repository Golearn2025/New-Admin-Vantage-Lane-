/**
 * useDriverDocuments Hook
 * 
 * Fetches driver documents with filtering and expiry calculations
 */

import useSWR from 'swr';
import type { DocumentData } from '@entities/driver';
import { createClient } from '@/lib/supabase/client';

interface UseDriverDocumentsResult {
  documents: DocumentData[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

/**
 * Fetch driver documents from database (both personal and vehicle)
 */
async function fetchDriverDocuments(driverId: string): Promise<DocumentData[]> {
  const supabase = createClient();

  // 1. Fetch driver personal documents
  const { data: driverDocs, error: driverError } = await supabase
    .from('driver_documents')
    .select('*')
    .eq('driver_id', driverId)
    .order('upload_date', { ascending: false });

  if (driverError) {
    throw new Error(`Failed to fetch driver documents: ${driverError.message}`);
  }

  // 2. Fetch vehicle documents for this driver's vehicles
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('id')
    .eq('driver_id', driverId);

  let vehicleDocs: any[] = [];
  if (!vehiclesError && vehicles && vehicles.length > 0) {
    const vehicleIds = vehicles.map(v => v.id);
    const { data: vDocs, error: vDocsError } = await supabase
      .from('vehicle_documents')
      .select('*')
      .in('vehicle_id', vehicleIds)
      .order('upload_date', { ascending: false });

    if (!vDocsError && vDocs) {
      vehicleDocs = vDocs;
    }
  }

  // Map driver documents
  const mappedDriverDocs: DocumentData[] = (driverDocs || []).map((doc) => ({
    id: doc.id,
    driverId: doc.driver_id,
    documentType: doc.document_type,
    documentCategory: 'driver' as const,
    fileUrl: doc.file_url,
    fileName: doc.file_name,
    uploadDate: doc.upload_date,
    expiryDate: doc.expiry_date,
    status: doc.status as 'pending' | 'approved' | 'rejected' | 'expired' | 'expiring_soon' | 'replaced',
    reviewedBy: doc.reviewed_by,
    reviewedAt: doc.reviewed_at,
    rejectionReason: doc.rejection_reason,
    replacesDocumentId: doc.replaces_document_id || null,
    replacementReason: doc.replacement_reason || null,
  }));

  // Map vehicle documents
  const mappedVehicleDocs: DocumentData[] = vehicleDocs.map((doc) => ({
    id: doc.id,
    driverId: driverId, // Use driver_id from parent
    documentType: doc.document_type,
    documentCategory: 'vehicle' as const,
    fileUrl: doc.file_url,
    fileName: doc.file_name,
    uploadDate: doc.upload_date,
    expiryDate: doc.expiry_date,
    status: doc.status as 'pending' | 'approved' | 'rejected' | 'expired' | 'expiring_soon' | 'replaced',
    reviewedBy: doc.reviewed_by,
    reviewedAt: doc.reviewed_at,
    rejectionReason: doc.rejection_reason,
    replacesDocumentId: doc.replaces_document_id || null,
    replacementReason: doc.replacement_reason || null,
  }));

  // Combine and return all documents
  return [...mappedDriverDocs, ...mappedVehicleDocs];
}

/**
 * Hook to fetch and manage driver documents
 */
export function useDriverDocuments(driverId: string): UseDriverDocumentsResult {
  const { data, error, isLoading, mutate } = useSWR(
    driverId ? `driver-documents-${driverId}` : null,
    () => fetchDriverDocuments(driverId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    documents: data || [],
    isLoading,
    error: error || null,
    mutate,
  };
}
