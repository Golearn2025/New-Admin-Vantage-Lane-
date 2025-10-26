/**
 * Update Driver Document API
 * 
 * Update document metadata (expiry date, notes, etc).
 */

import { createClient } from '../../../shared/lib/supabase/client';
import type { DocumentUpdatePayload, DriverDocument } from '../types';

/**
 * Update document by ID
 */
export async function updateDocument(
  documentId: string,
  payload: DocumentUpdatePayload
): Promise<DriverDocument> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('driver_documents')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update document: ${error.message}`);
  }

  return data as DriverDocument;
}

/**
 * Update document expiry date
 */
export async function updateDocumentExpiry(
  documentId: string,
  expiryDate: string | null
): Promise<DriverDocument> {
  return updateDocument(documentId, { expiry_date: expiryDate });
}

/**
 * Update document notes
 */
export async function updateDocumentNotes(
  documentId: string,
  notes: string
): Promise<DriverDocument> {
  return updateDocument(documentId, { notes });
}
