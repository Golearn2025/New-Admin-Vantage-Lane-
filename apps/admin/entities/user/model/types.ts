/**
 * User Entity - Types
 * Domain types for user entity
 */

export type UserRole = 'admin' | 'operator' | 'driver' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * UnifiedUser - Common fields across all user types
 * Used for "All Users" table to display customers, drivers, admins, and operators
 */
export interface UnifiedUser {
  id: string;
  userType: 'customer' | 'driver' | 'admin' | 'operator';
  name: string;  // firstName + lastName for people, company name for operators
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  deletedAt?: string | null;  // Soft delete timestamp
  profilePhotoUrl?: string | null;  // Profile photo (drivers, admins)
}
