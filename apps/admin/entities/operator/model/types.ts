/**
 * Operator Entity - Type Definitions
 */

/**
 * Operator data from database (camelCase for app use)
 */
export interface OperatorData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Raw operator data from Supabase (snake_case)
 */
export interface OperatorRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateOperatorPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateOperatorPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}
