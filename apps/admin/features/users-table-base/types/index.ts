/**
 * UsersTableBase Types
 */

export type UserType = 'all' | 'customer' | 'driver' | 'operator' | 'admin';

export interface UsersTableBaseProps {
  userType: UserType;
  title: string;
  createLabel?: string;
  showCreateButton?: boolean;
  className?: string;
}
