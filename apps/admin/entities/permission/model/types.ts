/**
 * Permission Types
 */

export type UserRole = 'admin' | 'operator' | 'driver' | 'customer' | 'auditor';

export interface PageDefinition {
  id: string;
  pageKey: string;
  label: string;
  icon: string | null;
  href: string;
  parentKey: string | null;
  displayOrder: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  role: UserRole;
  pageKey: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  pageKey: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageWithPermission extends PageDefinition {
  enabled: boolean;
  hasOverride?: boolean;
}

export interface RolePermissionsResponse {
  role: UserRole;
  pages: PageWithPermission[];
}

export interface UserPermissionsResponse {
  userId: string;
  pages: PageWithPermission[];
}
