/**
 * Driver Documents Management
 * Document approval, rejection, and retrieval operations
 */

import { createClient } from '@/lib/supabase/client';
import type { 
  DocumentData,
  DocumentStatus
} from '../model/types';

/**
 * Get all documents for a driver
 */
export async function getDriverDocuments(driverId: string): Promise<DocumentData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('driver_documents')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(doc => ({
    id: doc.id,
    driverId: doc.driver_id,
    documentType: doc.document_type,
    documentCategory: doc.document_category || 'personal',
    fileUrl: doc.file_url,
    fileName: doc.file_name,
    uploadDate: doc.upload_date,
    expiryDate: doc.expiry_date,
    status: doc.status as DocumentStatus,
    reviewedBy: doc.reviewed_by,
    reviewedAt: doc.reviewed_at,
    rejectionReason: doc.rejection_reason,
    replacesDocumentId: doc.replaces_document_id,
    replacementReason: doc.replacement_reason,
  }));
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

  if (error) throw error;
}

/**
 * Reject a document with reason
 */
export async function rejectDocument(
  documentId: string,
  reason: string,
  adminId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('driver_documents')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  if (error) throw error;
}
