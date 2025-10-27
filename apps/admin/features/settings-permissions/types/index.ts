/**
 * Settings Permissions Types
 */

import type { UserRole, PageWithPermission } from '@entities/permission';

export interface SettingsPermissionsProps {
  className?: string;
}

export type PermissionView = 'role' | 'user';

export interface PermissionState {
  view: PermissionView;
  selectedRole: UserRole;
  selectedUserId: string | null;
  pages: PageWithPermission[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}
