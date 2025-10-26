/**
 * List Operators API
 * 
 * Fetch all operators for assignment dropdowns
 */

import { createClient } from '@/lib/supabase/client';

export interface Operator {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string | null;
  isActive: boolean;
  driverCount?: number;
}

/**
 * List all active operators
 */
export async function listOperators(): Promise<Operator[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, contact_email, contact_phone, is_active')
      .eq('org_type', 'operator')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('List operators error:', error);
      throw new Error(`Failed to fetch operators: ${error.message}`);
    }

    return (data || []).map((op) => ({
      id: op.id,
      name: op.name,
      contactEmail: op.contact_email,
      contactPhone: op.contact_phone,
      isActive: op.is_active,
    }));
  } catch (error) {
    console.error('List operators error:', error);
    throw error;
  }
}

/**
 * Get operator by ID
 */
export async function getOperator(id: string): Promise<Operator | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, contact_email, contact_phone, is_active')
      .eq('id', id)
      .eq('org_type', 'operator')
      .single();

    if (error) {
      console.error('Get operator error:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      isActive: data.is_active,
    };
  } catch (error) {
    console.error('Get operator error:', error);
    return null;
  }
}
