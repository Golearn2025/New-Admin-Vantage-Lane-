/**
 * UserCreateModal Types
 */

export type UserType = 'customer' | 'driver' | 'operator' | 'admin';

export interface UserCreateFormData {
  userType: UserType;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  // Driver specific
  operatorId?: string;
  // Operator specific
  commissionPct?: number;
  // Admin specific
  role?: 'super_admin' | 'admin' | 'support';
}

export interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
