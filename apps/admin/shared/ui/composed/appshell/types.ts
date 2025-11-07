/**
 * AppShell Types - Dark Premium Navigation
 *
 * Type definitions pentru sistem de navigație cu RBAC.
 * Clean separation între UI și business logic.
 */

import { IconName } from '@vantage-lane/ui-icons';

export type UserRole = 'admin' | 'operator' | 'driver';

export interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  auth_user_id?: string;
}

export interface NavMenuItem {
  icon: IconName;
  label: string;
  href: string;
  badgeCount?: number;
  children?: string[];
}

export interface AppShellProps {
  role: UserRole;
  currentPath: string;
  children: React.ReactNode;
  variant?: 'luxe';
  user?: UserInfo;
}

export interface SidebarNavProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (href: string) => void;
  // Reutilizabile features
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  expandable?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleExpand?: (href: string, expanded: boolean) => void;
}

export interface NavItemProps {
  href: string;
  icon: IconName;
  label: string;
  badgeCount?: number | undefined;
  isActive?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  subpages?: string[] | undefined;
  onNavigate: (href: string) => void;
  // Reutilizabile expand control
  onToggleExpand?: (href: string) => void;
}

export interface TopbarProps {
  role: UserRole;
  onMenuToggle: () => void;
  sidebarCollapsed?: boolean;
  user?: UserInfo;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
