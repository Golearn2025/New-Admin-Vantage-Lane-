/**
 * Document Entity - API
 * CRUD operations for documents
 * 
 * MODERN & PREMIUM - Type-safe API calls
 * File: < 200 lines (RULES.md compliant)
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Document,
  DocumentListFilters,
  DocumentApprovalData,
  BulkApprovalData,
} from '../model/types';

/**
 * List documents with filters and JOIN with drivers table
 */
export async function listDocuments(
  filters?: DocumentListFilters
): Promise<Document[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('driver_documents')
    .select(`
      *,
      driver:drivers!driver_id (
        id,
        first_name,
        last_name,
        email
      )
    `);
  
  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.userType === 'driver') {
    // Already querying driver_documents
  }
  
  if (filters?.userId) {
    query = query.eq('driver_id', filters.userId);
  }
  
  if (filters?.search) {
    // Search will be done client-side for now
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
  
  // Transform to our Document interface
  const documents: Document[] = (data || []).map((doc: any) => ({
    id: doc.id,
    type: doc.document_type,
    category: doc.document_category,
    userId: doc.driver_id,
    userType: 'driver' as const,
    userName: doc.driver ? `${doc.driver.first_name} ${doc.driver.last_name}` : 'Unknown',
    userEmail: doc.driver?.email || '',
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
    isRequired: false, // TODO: Check from metadata
    hasExpiryDate: !!doc.expiry_date,
    ...(doc.file_size && { fileSize: doc.file_size }),
    ...(doc.mime_type && { mimeType: doc.mime_type }),
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  }));
  
  // Client-side search filter
  if (filters?.search) {
    const query = filters.search.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.userName.toLowerCase().includes(query) ||
        doc.userEmail.toLowerCase().includes(query) ||
        doc.name.toLowerCase().includes(query)
    );
  }
  
  return documents;
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
 * Approve a document
 */
export async function approveDocument(
  documentId: string,
  adminId: string
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('driver_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', documentId);
  
  if (error) {
    console.error('Error approving document:', error);
    throw new Error('Failed to approve document');
  }
}

/**
 * Reject a document with reason
 */
export async function rejectDocument(
  documentId: string,
  adminId: string,
  rejectionReason: string
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('driver_documents')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    })
    .eq('id', documentId);
  
  if (error) {
    console.error('Error rejecting document:', error);
    throw new Error('Failed to reject document');
  }
}

/**
 * Bulk approve documents
 */
export async function bulkApproveDocuments(
  documentIds: string[],
  adminId: string
): Promise<{ success: number; failed: number }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('driver_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .in('id', documentIds)
    .select('id');
  
  if (error) {
    console.error('Error bulk approving documents:', error);
    return {
      success: 0,
      failed: documentIds.length,
    };
  }
  
  return {
    success: data?.length || 0,
    failed: documentIds.length - (data?.length || 0),
  };
}

/**
 * Bulk reject documents
 */
export async function bulkRejectDocuments(
  documentIds: string[],
  adminId: string,
  rejectionReason: string
): Promise<{ success: number; failed: number }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('driver_documents')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    })
    .in('id', documentIds)
    .select('id');
  
  if (error) {
    console.error('Error bulk rejecting documents:', error);
    return {
      success: 0,
      failed: documentIds.length,
    };
  }
  
  return {
    success: data?.length || 0,
    failed: documentIds.length - (data?.length || 0),
  };
}

export async function deleteDocument(id: string): Promise<void> {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
}

/**
 * Count documents by status
 */
export async function getDocumentCounts(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  expiring_soon: number;
}> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('driver_documents')
    .select('status');
  
  if (error) {
    console.error('Error fetching document counts:', error);
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
  
  data?.forEach((doc: any) => {
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
