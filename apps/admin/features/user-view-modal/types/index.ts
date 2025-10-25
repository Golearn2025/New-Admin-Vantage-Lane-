/**
 * UserViewModal Types
 */

import type { UnifiedUser } from '@entities/user';

export interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UnifiedUser | null;
}
