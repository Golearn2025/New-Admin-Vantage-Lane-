/**
 * Create User Server Action
 * 
 * Server-side action for creating users with auth account
 * Required for Supabase auth.admin API access
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
    // License info removed - retrieved from driver_documents table
  };
}

/**
 * Server Action for creating users with auth accounts
 */
export async function createUserAction({
  userType,
  data,
}: CreateUserParams): Promise<{ success: boolean; userId: string; authUserId?: string | undefined }> {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  try {
    let authUserId: string | undefined;

    // Step 1: Create auth user for drivers, customers, and admins (they need portal access)
    if (userType === 'driver' || userType === 'customer' || userType === 'admin') {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password || generateTemporaryPassword(),
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: userType, // Store as 'role' for RLS policies (admin/driver/customer)
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
        await supabaseAdmin.auth.admin.deleteUser(authUserId);
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
 */
function generateTemporaryPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
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
      } else {
        // Default organization_id if not provided (for now, use first active org)
        // TODO: Make operator selection mandatory in create driver form
        mapped.organization_id = 'b59029eb-6245-489d-83a2-505cc041522d'; // Default Vantage Lane org
      }
      // License info will be populated from driver_documents when approved
      // No longer storing duplicate data in drivers table
      mapped.is_approved = false;
    }
  }

  return mapped;
}
