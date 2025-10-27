/**
 * Update User API
 * 
 * Updates user information across different user types
 */

import { createClient } from '@/lib/supabase/client';

export interface UpdateUserParams {
  userId: string;
  userType: 'customer' | 'driver' | 'admin' | 'operator';
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: 'active' | 'inactive';
    // Operator specific
    name?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

/**
 * Update user in appropriate table based on userType
 */
export async function updateUser({
  userId,
  userType,
  data,
}: UpdateUserParams): Promise<{ success: boolean }> {
  const supabase = createClient();

  try {
    const table = getTableName(userType);
    const updateData = mapDataToTableFormat(userType, data);

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Update user error:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Update user error:', error);
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
function mapDataToTableFormat(userType: string, data: UpdateUserParams['data']): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  if (userType === 'operator') {
    // Organizations table has different field names
    if (data.name) mapped.name = data.name;
    if (data.contactEmail) mapped.contact_email = data.contactEmail;
    if (data.contactPhone) mapped.contact_phone = data.contactPhone;
    if (data.status) mapped.is_active = data.status === 'active';
  } else {
    // customers, drivers, admin_users tables
    if (data.firstName) mapped.first_name = data.firstName;
    if (data.lastName) mapped.last_name = data.lastName;
    if (data.email) mapped.email = data.email;
    if (data.phone) mapped.phone = data.phone;
    
    // Different status field names
    if (data.status !== undefined) {
      if (userType === 'customer') {
        mapped.status = data.status;
      } else {
        mapped.is_active = data.status === 'active';
      }
    }
  }

  mapped.updated_at = new Date().toISOString();

  return mapped;
}
