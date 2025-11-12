/**
 * Document Entity - Database Queries
 * Read operations for documents
 * 
 * MODERN & PREMIUM - Type-safe queries
 * File: < 200 lines (RULES.md compliant)
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Document,
  DocumentListFilters,
} from '../model/types';

/**
 * List documents with filters - Fetches from BOTH driver_documents AND vehicle_documents
 */
export async function listDocuments(
  filters?: DocumentListFilters
): Promise<Document[]> {
  const supabase = createClient();
  
  // 1. Fetch driver documents
  let driverQuery = supabase
    .from('driver_documents')
    .select(`
      *,
      driver:drivers!driver_id (
        id,
        first_name,
        last_name
      )
    `)
    .neq('status', 'replaced');
  
  if (filters?.status) {
    driverQuery = driverQuery.eq('status', filters.status);
  }
  
  if (filters?.userId) {
    driverQuery = driverQuery.eq('driver_id', filters.userId);
  }
  
  const { data: driverDocs, error: driverError } = await driverQuery;
  
  if (driverError) {
    console.error('Error fetching driver documents:', driverError);
  }
  
  // 2. Fetch vehicle documents (with driver info via vehicles join)
  let vehicleQuery = supabase
    .from('vehicle_documents')
    .select(`
      *,
      vehicle:vehicles!vehicle_id (
        id,
        driver_id,
        license_plate,
        driver:drivers!driver_id (
          id,
          first_name,
          last_name
        )
      )
    `)
    .neq('status', 'replaced');
  
  if (filters?.status) {
    vehicleQuery = vehicleQuery.eq('status', filters.status);
  }
  
  // Filter by driver if userId provided
  if (filters?.userId) {
    // Need to filter by vehicle.driver_id, but can't do in query
    // Will filter client-side below
  }
  
  const { data: vehicleDocs, error: vehicleError } = await vehicleQuery;
  
  if (vehicleError) {
    console.error('Error fetching vehicle documents:', vehicleError);
  }
  
  // 3. Transform driver documents
  const mappedDriverDocs: Document[] = (driverDocs || []).map((doc: any) => ({
    id: doc.id,
    type: doc.document_type,
    category: 'driver' as const, // Force category for clarity
    userId: doc.driver_id,
    userType: 'driver' as const,
    userName: doc.driver ? `${doc.driver.first_name} ${doc.driver.last_name}` : 'Unknown',
    userEmail: '',
    name: doc.file_name || doc.document_type,
    description: doc.notes || '',
    ...(doc.file_url && { fileUrl: doc.file_url }),
    status: doc.status || 'pending',
    uploadDate: doc.upload_date || doc.created_at,
    ...(doc.expiry_date && { expiryDate: doc.expiry_date }),
    ...(doc.reviewed_by && { approvedBy: doc.reviewed_by }),
    ...(doc.reviewed_at && { approvedAt: doc.reviewed_at }),
    ...(doc.reviewed_by && { rejectedBy: doc.reviewed_by }),
    ...(doc.reviewed_at && { rejectedAt: doc.reviewed_at }),
    ...(doc.rejection_reason && { rejectionReason: doc.rejection_reason }),
    isRequired: false,
    hasExpiryDate: !!doc.expiry_date,
    ...(doc.file_size && { fileSize: doc.file_size }),
    ...(doc.mime_type && { mimeType: doc.mime_type }),
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  }));
  
  // 4. Transform vehicle documents
  const mappedVehicleDocs: Document[] = (vehicleDocs || [])
    .filter((doc: any) => {
      // Filter by userId if provided
      if (filters?.userId && doc.vehicle?.driver_id !== filters.userId) {
        return false;
      }
      return true;
    })
    .map((doc: any) => ({
      id: doc.id,
      type: doc.document_type,
      category: 'vehicle' as const, // Vehicle category
      userId: doc.vehicle?.driver_id || '',
      userType: 'driver' as const,
      userName: doc.vehicle?.driver ? `${doc.vehicle.driver.first_name} ${doc.vehicle.driver.last_name}` : 'Unknown',
      userEmail: '',
      name: doc.file_name || doc.document_type,
      description: doc.notes || '',
      ...(doc.file_url && { fileUrl: doc.file_url }),
      status: doc.status || 'pending',
      uploadDate: doc.upload_date || doc.created_at,
      ...(doc.expiry_date && { expiryDate: doc.expiry_date }),
      ...(doc.reviewed_by && { approvedBy: doc.reviewed_by }),
      ...(doc.reviewed_at && { approvedAt: doc.reviewed_at }),
      ...(doc.reviewed_by && { rejectedBy: doc.reviewed_by }),
      ...(doc.reviewed_at && { rejectedAt: doc.reviewed_at }),
      ...(doc.rejection_reason && { rejectionReason: doc.rejection_reason }),
      isRequired: false,
      hasExpiryDate: !!doc.expiry_date,
      ...(doc.file_size && { fileSize: doc.file_size }),
      ...(doc.mime_type && { mimeType: doc.mime_type }),
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    }));
  
  // 5. Combine both types of documents
  let allDocuments = [...mappedDriverDocs, ...mappedVehicleDocs];
  
  // 6. Client-side search filter
  if (filters?.search) {
    const searchQuery = filters.search.toLowerCase();
    allDocuments = allDocuments.filter(
      (doc) =>
        doc.userName.toLowerCase().includes(searchQuery) ||
        doc.name.toLowerCase().includes(searchQuery)
    );
  }
  
  // 7. Sort by upload date (newest first)
  allDocuments.sort((a, b) => {
    const dateA = new Date(a.uploadDate).getTime();
    const dateB = new Date(b.uploadDate).getTime();
    return dateB - dateA;
  });
  
  return allDocuments;
}

export async function getDocumentById(id: string): Promise<Document | null> {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return null;
}

export async function getDriverDocuments(driverId: string): Promise<Document[]> {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [];
}

/**
 * Count documents by status - Counts from BOTH driver_documents AND vehicle_documents
 */
export async function getDocumentCounts(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  expiring_soon: number;
}> {
  const supabase = createClient();
  
  // Fetch driver documents
  const { data: driverDocs, error: driverError } = await supabase
    .from('driver_documents')
    .select('status')
    .neq('status', 'replaced');
  
  // Fetch vehicle documents
  const { data: vehicleDocs, error: vehicleError } = await supabase
    .from('vehicle_documents')
    .select('status')
    .neq('status', 'replaced');
  
  if (driverError || vehicleError) {
    console.error('Error fetching document counts:', driverError || vehicleError);
    return {
      pending: 0,
      approved: 0,
      rejected: 0,
      expired: 0,
      expiring_soon: 0,
    };
  }
  
  const counts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
    expiring_soon: 0,
  };
  
  // Count driver documents
  driverDocs?.forEach((doc: any) => {
    const status = doc.status as keyof typeof counts;
    if (status && status in counts) {
      counts[status]++;
    }
  });
  
  // Count vehicle documents
  vehicleDocs?.forEach((doc: any) => {
    const status = doc.status as keyof typeof counts;
    if (status && status in counts) {
      counts[status]++;
    }
  });
  
  return counts;
}

// Check if driver has all required documents approved
export async function checkDriverDocumentsComplete(
  driverId: string
): Promise<{
  complete: boolean;
  missingDocuments: string[];
  rejectedDocuments: string[];
  expiredDocuments: string[];
}> {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return {
    complete: false,
    missingDocuments: [],
    rejectedDocuments: [],
    expiredDocuments: [],
  };
}
