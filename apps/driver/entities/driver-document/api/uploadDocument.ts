/**
 * Upload Driver Document API
 * 
 * Upload document file to Supabase Storage and create DB record.
 */

import { createClient } from '../../../shared/lib/supabase/client';
import type { DocumentUploadPayload, DriverDocument } from '../types';

/**
 * Upload document file to storage
 */
async function uploadFileToStorage(
  driverId: string,
  file: File,
  documentType: string
): Promise<{ path: string; url: string }> {
  const supabase = createClient();

  // Generate unique file name
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${documentType}_${timestamp}.${fileExt}`;
  const filePath = `${driverId}/${fileName}`;

  // Upload to driver-documents bucket
  const { error: uploadError } = await supabase.storage
    .from('driver-documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('driver-documents')
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: urlData.publicUrl,
  };
}

/**
 * Upload document (file + DB record)
 */
export async function uploadDocument(
  driverId: string,
  payload: DocumentUploadPayload
): Promise<DriverDocument> {
  const supabase = createClient();

  // Upload file to storage
  const { path, url } = await uploadFileToStorage(
    driverId,
    payload.file,
    payload.document_type
  );

  // Create or update DB record
  const documentData = {
    driver_id: driverId,
    document_type: payload.document_type,
    document_category: 'driver' as const,
    file_url: url,
    file_name: payload.file.name,
    file_size: payload.file.size,
    mime_type: payload.file.type,
    expiry_date: payload.expiry_date || null,
    notes: payload.notes || null,
    status: 'pending' as const,
    upload_date: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('driver_documents')
    .upsert(documentData, {
      onConflict: 'driver_id,document_type',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save document: ${error.message}`);
  }

  return data as DriverDocument;
}
