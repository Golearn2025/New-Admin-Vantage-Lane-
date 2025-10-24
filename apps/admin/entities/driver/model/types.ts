/**
 * Driver Entity - Type Definitions
 */

/**
 * Driver data from database (camelCase for app use)
 */
export interface DriverData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Raw driver data from Supabase (snake_case)
 */
export interface DriverRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateDriverPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateDriverPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}
