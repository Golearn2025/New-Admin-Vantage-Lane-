/**
 * Get Driver Documents API
 * 
 * Fetch all documents for the current driver.
 */

import { createClient } from '../../../shared/lib/supabase/client';
import type { DriverDocument, DocumentWithExpiry } from '../types';

/**
 * Calculate days until expiry and expiry status
 */
function calculateExpiryInfo(doc: DriverDocument): DocumentWithExpiry {
  let days_until_expiry: number | null = null;
  let is_expired = false;
  let is_expiring_soon = false;

  if (doc.expiry_date) {
    const expiryDate = new Date(doc.expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    days_until_expiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    is_expired = days_until_expiry < 0;
    is_expiring_soon = days_until_expiry >= 0 && days_until_expiry <= 30;
  }

  return {
    ...doc,
    days_until_expiry,
    is_expired,
    is_expiring_soon,
  };
}

/**
 * Get all documents for current driver
 */
export async function getDocuments(): Promise<DocumentWithExpiry[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('driver_documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return (data as DriverDocument[]).map(calculateExpiryInfo);
}

/**
 * Get single document by type
 */
export async function getDocumentByType(
  documentType: string
): Promise<DocumentWithExpiry | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('driver_documents')
    .select('*')
    .eq('document_type', documentType)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch document: ${error.message}`);
  }

  return calculateExpiryInfo(data as DriverDocument);
}
