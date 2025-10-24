/**
 * Customer Entity - Type Definitions
 */

/**
 * Customer data from database (camelCase for app use)
 */
export interface CustomerData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Raw customer data from Supabase (snake_case)
 */
export interface CustomerRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateCustomerPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateCustomerPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}
