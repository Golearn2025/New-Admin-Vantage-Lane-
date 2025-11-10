/**
 * Upload Document API
 * 
 * Upload document to Supabase Storage and create DB record
 * Zero UI logic
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { DocumentType } from '../model/types';

interface UploadDocumentParams {
  driverId: string;
  documentType: DocumentType;
  fileData: number[];
  fileName: string;
  fileType: string;
  fileSize: number;
  expiryDate?: string | undefined;
}

interface UploadDocumentResult {
  success: boolean;
  documentId?: string;
  fileUrl?: string;
  error?: string;
}

export async function uploadDocument({
  driverId,
  documentType,
  fileData,
  fileName: originalFileName,
  fileType,
  fileSize,
  expiryDate,
}: UploadDocumentParams): Promise<UploadDocumentResult> {
  try {
    const supabase = createClient();

    // Get auth user to use as folder name (matches RLS policy)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // 1. Upload file to Supabase Storage
    const fileExt = originalFileName.split('.').pop();
    const storagePath = `${user.id}/${documentType}-${Date.now()}.${fileExt}`;
    const bucket = 'driver-documents';

    // Convert number[] back to Uint8Array for Supabase
    const uint8Array = new Uint8Array(fileData);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, uint8Array, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    // 3. Create document record in driver_documents table
    const { data: document, error: dbError } = await supabase
      .from('driver_documents')
      .insert({
        driver_id: driverId,
        document_type: documentType,
        document_category: 'driver',
        file_url: publicUrl,
        file_name: originalFileName,
        file_size: fileSize,
        mime_type: fileType,
        upload_date: new Date().toISOString(),
        expiry_date: expiryDate || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
      // Cleanup uploaded file
      await supabase.storage.from(bucket).remove([storagePath]);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return {
      success: true,
      documentId: document.id,
      fileUrl: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
