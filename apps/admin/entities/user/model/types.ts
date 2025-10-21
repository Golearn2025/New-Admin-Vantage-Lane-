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
