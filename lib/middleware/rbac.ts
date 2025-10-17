/**
 * RBAC Middleware - 100% REUSABLE
 * 
 * Centralized role-based access control
 * Used across all API routes
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export type AdminRole = 'super_admin' | 'admin' | 'operator';

export interface RBACOptions {
  allowedRoles?: AdminRole[];
  requireActive?: boolean;
}

export interface RBACResult {
  authorized: boolean;
  user?: any;
  adminUser?: any;
  error?: NextResponse;
}

/**
 * Check if user has required admin permissions
 * 
 * @param options - RBAC options
 * @returns RBACResult with authorization status
 */
export async function checkAdminAccess(
  options: RBACOptions = {}
): Promise<RBACResult> {
  const {
    allowedRoles = ['super_admin', 'admin'],
    requireActive = true,
  } = options;
  
  try {
    // Create Supabase client with user context (RLS enforced)
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        ),
      };
    }
    
    // Get admin user details
    const { data: adminUser, error: rbacError } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('auth_user_id', user.id)
      .single();
    
    if (rbacError || !adminUser) {
      return {
        authorized: false,
        user,
        error: NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        ),
      };
    }
    
    // Check if active (if required)
    if (requireActive && !adminUser.is_active) {
      return {
        authorized: false,
        user,
        adminUser,
        error: NextResponse.json(
          { error: 'Forbidden - Account is inactive' },
          { status: 403 }
        ),
      };
    }
    
    // Check role permissions
    if (!allowedRoles.includes(adminUser.role as AdminRole)) {
      return {
        authorized: false,
        user,
        adminUser,
        error: NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        ),
      };
    }
    
    // All checks passed
    return {
      authorized: true,
      user,
      adminUser,
    };
  } catch (error) {
    console.error('RBAC check error:', error);
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}
