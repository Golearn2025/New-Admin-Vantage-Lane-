/**
 * AppShell - Dark Premium Navigation System
 * 
 * Export pentru componentele principale de navigație.
 * Tree-shakable imports pentru performanță optimă.
 */

export { AppShell } from './AppShell';
export { SidebarNav } from './SidebarNav';
export { NavItem } from './NavItem';
export { Topbar } from './Topbar';
export { Drawer } from './Drawer';

// Export pentru configurație și utilities
export { getMenuForRole, isMenuItemActive, isMenuItemExpanded } from './menu-config';

// Export types
export type {
  UserRole,
  NavMenuItem,
  AppShellProps,
  SidebarNavProps,
  NavItemProps,
  TopbarProps,
  DrawerProps,
  BreadcrumbItem,
  BreadcrumbsProps,
  PageHeaderProps
} from './types';
