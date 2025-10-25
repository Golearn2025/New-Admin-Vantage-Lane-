/**
 * UserEditModal Types
 */

import type { UnifiedUser } from '@entities/user';

export interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UnifiedUser | null;
}

export interface UserEditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}
