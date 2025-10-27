/**
 * AppShell Types - Driver Portal
 * 
 * Type definitions for navigation and layout.
 */

import { IconName } from '@vantage-lane/ui-icons';

export type UserRole = 'driver';

export interface NavMenuItem {
  icon: IconName;
  label: string;
  href: string;
  children?: string[];
  badge?: number | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AppShellProps {
  role: UserRole;
  currentPath: string;
  children: React.ReactNode;
  user?: User;
}

export interface TopbarProps {
  role: UserRole;
  onMenuToggle: () => void;
  sidebarCollapsed?: boolean;
  user?: User;
}

export interface SidebarNavProps {
  role: UserRole;
  currentPath: string;
  onNavigate: (href: string) => void;
  collapsible?: boolean;
  expandable?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface NavItemProps {
  item: NavMenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onNavigate: (href: string) => void;
  collapsed?: boolean;
}
