/**
 * Create User API
 * 
 * Creates new users across different user types
 * For drivers and customers: creates auth.users account for portal access
 */

import { createClient } from '@/lib/supabase/server';
import { generateSecurePassword } from '../lib/passwordGenerator';

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
    licenseNumber?: string;
    licenseExpiry?: string;
  };
}

/**
 * Create new user in appropriate table based on userType
 */
export async function createUser({
  userType,
  data,
}: CreateUserParams): Promise<{ success: boolean; userId: string; authUserId?: string | undefined }> {
  const supabase = createClient();

  try {
    let authUserId: string | undefined;

    // Step 1: Create auth user for drivers and customers (they need portal access)
    if (userType === 'driver' || userType === 'customer') {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password || generateTemporaryPassword(),
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
          user_type: userType,
        },
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        throw new Error(`Failed to create auth account: ${authError.message}`);
      }

      authUserId = authUser.user.id;
    }

    // Step 2: Create record in appropriate table with auth_user_id link
    const table = getTableName(userType);
    const insertData = mapDataToTableFormat(userType, data, authUserId);

    const { data: result, error } = await supabase
      .from(table)
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      console.error('Create user error:', error);
      
      // Rollback: delete auth user if table insert fails
      if (authUserId) {
        await supabase.auth.admin.deleteUser(authUserId);
      }
      
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      success: true,
      userId: result.id,
      authUserId: authUserId || undefined,
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
 * Generate temporary password for new users
 * Now using cryptographically secure generation
 */
function generateTemporaryPassword(): string {
  return generateSecurePassword(12);
}

/**
 * Map generic data to table-specific format
 */
function mapDataToTableFormat(
  userType: string, 
  data: CreateUserParams['data'],
  authUserId?: string
): Record<string, unknown> {
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
    
    // Link auth user ID if provided
    if (authUserId) {
      mapped.auth_user_id = authUserId;
    }
    
    if (userType === 'customer') {
      mapped.status = 'active';
    } else if (userType === 'driver') {
      mapped.is_active = false; // Drivers start INACTIVE until approved
    } else {
      mapped.is_active = true; // Operators and Admins start active
    }

    // Driver specific fields
    if (userType === 'driver') {
      if (data.operatorId) {
        mapped.organization_id = data.operatorId;
      }
      // Required fields for drivers
      mapped.license_number = data.licenseNumber || 'PENDING';
      mapped.license_expiry = data.licenseExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      mapped.is_approved = false;
    }
  }

  mapped.created_at = new Date().toISOString();
  mapped.updated_at = new Date().toISOString();

  return mapped;
}
