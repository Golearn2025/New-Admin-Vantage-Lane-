/**
 * Admin Entity - Type Definitions
 */

/**
 * Admin data from database (camelCase for app use)
 */
export interface AdminData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Raw admin data from Supabase (snake_case)
 */
export interface AdminRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateAdminPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateAdminPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}
