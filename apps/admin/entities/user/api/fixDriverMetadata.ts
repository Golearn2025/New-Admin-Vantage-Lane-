/**
 * Fix Driver Metadata - One-time migration
 * 
 * Updates auth.users metadata for existing drivers
 * Changes user_type → role for proper role detection
 */

'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function fixDriverMetadata(email: string) {
  const supabaseAdmin = createAdminClient();

  try {
    // Get user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`User not found: ${email}`);
    }

    // Update metadata: change user_type to role
    const currentMetadata = user.user_metadata || {};
    const userType = currentMetadata.user_type || currentMetadata.role;

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...currentMetadata,
          role: userType || 'driver', // Set role field
          // Keep other fields
          first_name: currentMetadata.first_name,
          last_name: currentMetadata.last_name,
        },
      }
    );

    if (updateError) {
      throw new Error(`Failed to update user: ${updateError.message}`);
    }

    return {
      success: true,
      message: `Updated metadata for ${email}`,
    };
  } catch (error) {
    console.error('Fix driver metadata error:', error);
    throw error;
  }
}
