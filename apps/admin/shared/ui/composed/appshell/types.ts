/**
 * AppShell Types - Dark Premium Navigation
 * 
 * Type definitions pentru sistem de navigație cu RBAC.
 * Clean separation între UI și business logic.
 */

import { IconName } from '@admin/shared/ui/icons';

export type UserRole = 'admin' | 'operator';

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
  variant?: 'minimal' | 'luxe';
}

export interface SidebarNavProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (href: string) => void;
  variant?: 'minimal' | 'luxe';
}

export interface NavItemProps {
  href: string;
  icon: IconName;
  label: string;
  badgeCount?: number | undefined;
  isActive?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  children?: string[] | undefined;
  onNavigate: (href: string) => void;
  variant?: 'minimal' | 'luxe';
}

export interface TopbarProps {
  role: UserRole;
  onMenuToggle: () => void;
  searchPlaceholder?: string;
  variant?: 'minimal' | 'luxe';
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
  variant?: 'minimal' | 'luxe';
}
