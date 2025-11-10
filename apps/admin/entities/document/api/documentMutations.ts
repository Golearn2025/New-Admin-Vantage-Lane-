/**
 * Document Entity - Database Mutations
 * Write operations for documents (approve, reject, delete)
 * 
 * MODERN & PREMIUM - Type-safe mutations
 * File: < 200 lines (RULES.md compliant)
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { sendNotificationToDriver } from '@entities/notification';

/**
 * Approve a document
 * Implements document replacement workflow:
 * 1. Find old approved document (same driver + type)
 * 2. Mark old document as 'replaced'
 * 3. Approve new document
 */
export async function approveDocument(
  documentId: string,
  adminId: string
): Promise<void> {
  const supabase = createClient();
  
  // 1. Get the document being approved
  const { data: newDoc, error: fetchError } = await supabase
    .from('driver_documents')
    .select('driver_id, document_type')
    .eq('id', documentId)
    .single();
  
  if (fetchError || !newDoc) {
    console.error('Error fetching document:', fetchError);
    throw new Error('Failed to fetch document');
  }
  
  // 2. Find ALL existing approved documents (same driver + type, excluding current)
  const { data: oldDocs } = await supabase
    .from('driver_documents')
    .select('id, file_url, document_type')
    .eq('driver_id', newDoc.driver_id)
    .eq('document_type', newDoc.document_type)
    .eq('status', 'approved')
    .neq('id', documentId); // Exclude the document being approved
  
  // 3. Process ALL old docs (delete for profile_photo, replace for others)
  if (oldDocs && oldDocs.length > 0) {
    for (const oldDoc of oldDocs) {
      // For profile_photo, DELETE completely from storage and DB
      if (oldDoc.document_type === 'profile_photo') {
        // Extract storage path from URL and delete file
        if (oldDoc.file_url) {
          const urlParts = oldDoc.file_url.split('/driver-documents/');
          if (urlParts.length === 2) {
            const storagePath = urlParts[1].split('?')[0];
            
            // Delete file from storage (ignore errors if file doesn't exist)
            await supabase.storage
              .from('driver-documents')
              .remove([storagePath]);
          }
        }
        
        // Delete DB record
        await supabase
          .from('driver_documents')
          .delete()
          .eq('id', oldDoc.id);
      } else {
        // For other documents, mark as replaced (keep for audit)
        await supabase
          .from('driver_documents')
          .update({
            status: 'replaced',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', oldDoc.id);
      }
    }
  }
  
  // 4. Approve the new document
  const { data: approvedDoc, error } = await supabase
    .from('driver_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      replaces_document_id: (oldDocs && oldDocs.length > 0) ? oldDocs[0]?.id : null,
    })
    .eq('id', documentId)
    .select('file_url, document_type')
    .single();
  
  if (error) {
    console.error('Error approving document:', error);
    throw new Error('Failed to approve document');
  }
  
  // 5. If this is a profile_photo, update the drivers table
  if (approvedDoc && approvedDoc.document_type === 'profile_photo') {
    await supabase
      .from('drivers')
      .update({ profile_photo_url: approvedDoc.file_url })
      .eq('id', newDoc.driver_id);
  }
  
  // Send notification if driver exists
  if (newDoc.driver_id) {
    try {
      await sendNotificationToDriver(
        newDoc.driver_id,
        '✅ Document Approved',
        `Your ${newDoc.document_type.replace(/_/g, ' ')} has been approved!`
      );
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't throw - approval succeeded
    }
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
  
  // Get document info first
  const { data: doc } = await supabase
    .from('driver_documents')
    .select('driver_id, type')
    .eq('id', documentId)
    .single();
  
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

  // Send notification if driver exists
  if (doc?.driver_id) {
    try {
      await sendNotificationToDriver(
        doc.driver_id,
        '❌ Document Rejected',
        `Your ${doc.type.replace(/_/g, ' ')} was rejected. Reason: ${rejectionReason}`
      );
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't throw - rejection succeeded
    }
  }
}

/**
 * Bulk approve documents - Updates BOTH driver_documents AND vehicle_documents
 */
export async function bulkApproveDocuments(
  documentIds: string[],
  adminId: string
): Promise<{ success: number; failed: number }> {
  const supabase = createClient();
  
  // Update driver documents
  const { data: driverData, error: driverError } = await supabase
    .from('driver_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .in('id', documentIds)
    .select('id');
  
  // Update vehicle documents
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicle_documents')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .in('id', documentIds)
    .select('id');
  
  if (driverError && vehicleError) {
    console.error('Error bulk approving documents:', driverError || vehicleError);
    return {
      success: 0,
      failed: documentIds.length,
    };
  }
  
  const totalSuccess = (driverData?.length || 0) + (vehicleData?.length || 0);
  
  return {
    success: totalSuccess,
    failed: documentIds.length - totalSuccess,
  };
}

/**
 * Bulk reject documents - Updates BOTH driver_documents AND vehicle_documents
 */
export async function bulkRejectDocuments(
  documentIds: string[],
  adminId: string,
  rejectionReason: string
): Promise<{ success: number; failed: number }> {
  const supabase = createClient();
  
  // Update driver documents
  const { data: driverData, error: driverError } = await supabase
    .from('driver_documents')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    })
    .in('id', documentIds)
    .select('id');
  
  // Update vehicle documents
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicle_documents')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
    })
    .in('id', documentIds)
    .select('id');
  
  if (driverError && vehicleError) {
    console.error('Error bulk rejecting documents:', driverError || vehicleError);
    return {
      success: 0,
      failed: documentIds.length,
    };
  }
  
  const totalSuccess = (driverData?.length || 0) + (vehicleData?.length || 0);
  
  return {
    success: totalSuccess,
    failed: documentIds.length - totalSuccess,
  };
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
}
