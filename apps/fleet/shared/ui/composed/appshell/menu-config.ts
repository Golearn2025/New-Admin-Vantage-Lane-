/**
 * Menu Configuration - Fleet Portal
 */

import { NavMenuItem, UserRole } from './types';

// Operator Menu
const operatorMenu: NavMenuItem[] = [
  { 
    icon: 'dashboard', 
    label: 'Dashboard', 
    href: '/dashboard',
  },
  { 
    icon: 'users', 
    label: 'My Drivers', 
    href: '/drivers',
  },
  { 
    icon: 'calendar', 
    label: 'Bookings', 
    href: '/bookings',
  },
  { 
    icon: 'documents', 
    label: 'Documents', 
    href: '/documents',
  },
  { 
    icon: 'support', 
    label: 'Support', 
    href: '/support',
  },
  { 
    icon: 'settings', 
    label: 'Settings', 
    href: '/settings',
  },
];

/**
 * Get menu for role
 */
export function getMenuForRole(role: UserRole): NavMenuItem[] {
  return operatorMenu;
}

/**
 * Check if menu item is active
 */
export function isMenuItemActive(item: NavMenuItem, currentPath: string): boolean {
  if (item.href === currentPath) {
    return true;
  }

  if (item.children) {
    return item.children.includes(currentPath);
  }

  return currentPath.startsWith(item.href + '/');
}

/**
 * Check if menu item is expanded
 */
export function isMenuItemExpanded(item: NavMenuItem, currentPath: string): boolean {
  if (!item.children) {
    return false;
  }

  return item.children.some(
    (childPath) => currentPath === childPath || currentPath.startsWith(childPath + '/')
  );
}
