/**
 * Create User API
 * 
 * Creates new users across different user types
 */

import { createClient } from '@/lib/supabase/client';

export interface CreateUserParams {
  userType: 'customer' | 'driver' | 'admin' | 'operator';
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    password?: string;
    // Operator specific
    name?: string;
    contactEmail?: string;
    contactPhone?: string;
    orgType?: string;
    // Driver specific
    operatorId?: string;
    vehicleCategory?: string;
  };
}

/**
 * Create new user in appropriate table based on userType
 */
export async function createUser({
  userType,
  data,
}: CreateUserParams): Promise<{ success: boolean; userId: string }> {
  const supabase = createClient();

  try {
    const table = getTableName(userType);
    const insertData = mapDataToTableFormat(userType, data);

    const { data: result, error } = await supabase
      .from(table)
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      console.error('Create user error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      success: true,
      userId: result.id,
    };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

/**
 * Get table name based on user type
 */
function getTableName(userType: string): string {
  switch (userType) {
    case 'customer':
      return 'customers';
    case 'driver':
      return 'drivers';
    case 'admin':
      return 'admin_users';
    case 'operator':
      return 'organizations';
    default:
      throw new Error(`Unknown user type: ${userType}`);
  }
}

/**
 * Map generic data to table-specific format
 */
function mapDataToTableFormat(userType: string, data: CreateUserParams['data']): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  if (userType === 'operator') {
    // Organizations table
    mapped.name = data.name || 'Unnamed Operator';
    mapped.contact_email = data.contactEmail || data.email;
    mapped.contact_phone = data.contactPhone || data.phone;
    mapped.org_type = 'operator';
    mapped.is_active = true;
  } else {
    // customers, drivers, admin_users tables
    mapped.first_name = data.firstName || '';
    mapped.last_name = data.lastName || '';
    mapped.email = data.email;
    mapped.phone = data.phone || '';
    
    if (userType === 'customer') {
      mapped.status = 'active';
    } else {
      mapped.is_active = true;
    }

    // Driver specific fields
    if (userType === 'driver') {
      if (data.operatorId) {
        mapped.operator_id = data.operatorId;
      }
      if (data.vehicleCategory) {
        mapped.vehicle_category = data.vehicleCategory;
      }
      mapped.verification_status = 'pending';
    }
  }

  mapped.created_at = new Date().toISOString();
  mapped.updated_at = new Date().toISOString();

  return mapped;
}
