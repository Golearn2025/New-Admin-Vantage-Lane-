/**
 * UsersTableBase Types
 */

import type { UnifiedUser } from '@entities/user';

export type UserType = 'all' | 'customer' | 'driver' | 'operator' | 'admin';

export interface UsersTableBaseProps {
  userType: UserType;
  title: string;
  createLabel?: string;
  showCreateButton?: boolean;
  className?: string;
  
  /**
   * Custom view handler (overrides default modal)
   * Used for drivers to navigate to profile page
   */
  onViewCustom?: (user: UnifiedUser) => void;
  
  /**
   * RBAC: Use operator filter to show only assigned drivers
   * When true, uses useOperatorDrivers hook instead of useAllUsers
   */
  useOperatorFilter?: boolean;
}
