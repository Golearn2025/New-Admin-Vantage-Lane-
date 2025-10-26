/**
 * Delete Driver Document API
 * 
 * Delete document file from storage and DB record.
 */

import { createClient } from '../../../shared/lib/supabase/client';

/**
 * Delete document file from storage
 */
async function deleteFileFromStorage(filePath: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from('driver-documents')
    .remove([filePath]);

  if (error) {
    console.error('Failed to delete file from storage:', error);
    // Don't throw - continue with DB deletion even if file delete fails
  }
}

/**
 * Extract storage path from file URL
 */
function extractStoragePath(fileUrl: string | null): string | null {
  if (!fileUrl) return null;
  
  try {
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/driver-documents\/(.+)$/);
    return pathMatch ? (pathMatch[1] ?? null) : null;
  } catch {
    return null;
  }
}

/**
 * Delete document by ID
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const supabase = createClient();

  // Get document to extract file path
  const { data: doc, error: fetchError } = await supabase
    .from('driver_documents')
    .select('file_url')
    .eq('id', documentId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch document: ${fetchError.message}`);
  }

  // Delete file from storage
  const filePath = extractStoragePath(doc.file_url ?? null);
  if (filePath) {
    await deleteFileFromStorage(filePath);
  }

  // Delete DB record
  const { error: deleteError } = await supabase
    .from('driver_documents')
    .delete()
    .eq('id', documentId);

  if (deleteError) {
    throw new Error(`Failed to delete document: ${deleteError.message}`);
  }
}
