/**
 * Operator Entity - Types
 * 
 * Operators are organizations with org_type = 'operator'
 * Database row (snake_case) and application data (camelCase)
 */

/**
 * Raw database row from organizations table (snake_case)
 */
export interface OperatorRow {
  id: string;
  code: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  city: string | null;
  is_active: boolean;
  rating_average: string | null;
  created_at: string;
}

/**
 * Application data (camelCase)
 */
export interface OperatorData {
  id: string;
  code: string;
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
  city: string | null;
  isActive: boolean;
  ratingAverage: number | null;
  createdAt: string;
}

/**
 * Payload for creating operator
 */
export interface CreateOperatorPayload {
  code: string;
  name: string;
  org_type: 'operator';
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  is_active?: boolean;
}

/**
 * Payload for updating operator
 */
export interface UpdateOperatorPayload {
  name?: string;
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  is_active?: boolean;
}
