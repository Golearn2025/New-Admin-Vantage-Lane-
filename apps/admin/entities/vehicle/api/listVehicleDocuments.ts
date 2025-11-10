/**
 * List Vehicle Documents API
 * Fetch all documents for a vehicle
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface VehicleDocument {
  id: string;
  type: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  expiryDate?: string;
  status: string;
  rejectionReason?: string;
}

interface ListVehicleDocumentsParams {
  vehicleId: string;
}

export async function listVehicleDocuments(
  params: ListVehicleDocumentsParams
): Promise<VehicleDocument[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vehicle_documents')
      .select('*')
      .eq('vehicle_id', params.vehicleId)
      .order('upload_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map((doc) => ({
      id: doc.id,
      type: doc.document_type,
      fileUrl: doc.file_url,
      fileName: doc.file_name,
      uploadDate: doc.upload_date,
      expiryDate: doc.expiry_date,
      status: doc.status || 'pending',
      rejectionReason: doc.rejection_reason,
    }));
  } catch (error) {
    console.error('Failed to list vehicle documents:', error);
    return [];
  }
}
