/**
 * Get Operator Drivers API
 * Fetch drivers assigned to specific operator
 */

import { createClient } from '@/lib/supabase/client';

export interface OperatorDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profilePhoto: string | null;
  vehicleCategories: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdAt: string;
}

/**
 * Get all drivers for a specific operator
 */
export async function getOperatorDrivers(operatorId: string): Promise<OperatorDriver[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, email, first_name, last_name, phone, profile_photo_url, vehicle_categories, verification_status, is_active, created_at')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get operator drivers error:', error);
      throw new Error(`Failed to fetch operator drivers: ${error.message}`);
    }

    return (data || []).map((d) => ({
      id: d.id,
      firstName: d.first_name,
      lastName: d.last_name,
      email: d.email,
      phone: d.phone,
      profilePhoto: d.profile_photo_url,
      vehicleCategories: d.vehicle_categories || [],
      verificationStatus: d.verification_status,
      isActive: d.is_active,
      createdAt: d.created_at,
    }));
  } catch (error) {
    console.error('Get operator drivers error:', error);
    throw error;
  }
}

/**
 * Get pending drivers for operator
 */
export async function getOperatorPendingDrivers(operatorId: string): Promise<OperatorDriver[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('operator_id', operatorId)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get pending drivers error:', error);
      throw new Error(`Failed to fetch pending drivers: ${error.message}`);
    }

    return (data || []).map((d) => ({
      id: d.id,
      firstName: d.first_name,
      lastName: d.last_name,
      email: d.email,
      phone: d.phone,
      profilePhoto: d.profile_photo_url,
      vehicleCategories: d.vehicle_categories || [],
      verificationStatus: d.verification_status,
      isActive: d.is_active,
      createdAt: d.created_at,
    }));
  } catch (error) {
    console.error('Get pending drivers error:', error);
    throw error;
  }
}
