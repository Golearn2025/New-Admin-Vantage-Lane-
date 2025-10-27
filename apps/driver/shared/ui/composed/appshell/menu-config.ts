/**
 * Menu Configuration - Driver Portal
 * 
 * Navigation menu for driver portal.
 */

import { NavMenuItem, UserRole } from './types';

// Driver Menu
const driverMenu: NavMenuItem[] = [
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
    icon: 'creditCard', 
    label: 'Earnings', 
    href: '/earnings',
  },
  { 
    icon: 'users', 
    label: 'Profile', 
    href: '/profile',
  },
  { 
    icon: 'support', 
    label: 'Support', 
    href: '/support',
  },
];

/**
 * Get menu for role
 */
export function getMenuForRole(role: UserRole): NavMenuItem[] {
  return driverMenu;
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
