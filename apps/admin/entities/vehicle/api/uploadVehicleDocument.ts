/**
 * Upload Vehicle Document API
 * Upload document to Supabase Storage and create vehicle_documents record
 */

'use server';

import { createClient } from '@/lib/supabase/server';

interface UploadVehicleDocumentParams {
  vehicleId: string;
  documentType: string;
  fileData: number[];
  fileName: string;
  fileType: string;
  fileSize: number;
  expiryDate?: string | undefined;
}

interface UploadResult {
  success: boolean;
  documentId?: string;
  fileUrl?: string;
  error?: string;
}

export async function uploadVehicleDocument(
  params: UploadVehicleDocumentParams
): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Get auth user to use as folder name (matches RLS policy)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const fileExt = params.fileName.split('.').pop();
    const storagePath = `${user.id}/vehicles/${params.vehicleId}/${params.documentType}-${Date.now()}.${fileExt}`;
    const bucket = 'driver-documents';

    // Convert number[] back to Uint8Array for Supabase
    const uint8Array = new Uint8Array(params.fileData);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, uint8Array, {
        contentType: params.fileType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    const { data: document, error: dbError } = await supabase
      .from('vehicle_documents')
      .insert({
        vehicle_id: params.vehicleId,
        document_type: params.documentType,
        file_url: publicUrl,
        file_name: params.fileName,
        file_size: params.fileSize,
        mime_type: params.fileType,
        upload_date: new Date().toISOString(),
        expiry_date: params.expiryDate || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (dbError) {
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
