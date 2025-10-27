/**
 * Menu Configuration - RBAC Navigation Maps
 *
 * Definește meniurile exacte pe rol fără business logic.
 * Single source of truth pentru navigația aplicației.
 */

import { NavMenuItem, UserRole } from './types';

// Admin - Acces complet
const adminMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  {
    icon: 'calendar',
    label: 'Bookings',
    href: '/bookings',
    children: ['/bookings/active', '/bookings/past', '/bookings/new'],
  },
  {
    icon: 'users',
    label: 'Users',
    href: '/users',
    children: ['/users/all', '/users/drivers', '/users/drivers/pending', '/users/customers', '/users/operators', '/users/admins'],
  },
  { icon: 'documents', label: 'Documents', href: '/documents' },
  { icon: 'bell', label: 'Notifications', href: '/notifications' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'prices', label: 'Prices', href: '/prices' },
  { icon: 'creditCard', label: 'Payments', href: '/payments' },
  { icon: 'refunds', label: 'Refunds', href: '/refunds' },
  { icon: 'disputes', label: 'Disputes', href: '/disputes' },
  { icon: 'banknote', label: 'Payouts', href: '/payouts' },
  { icon: 'monitoring', label: 'Monitoring', href: '/monitoring' },
  { icon: 'projectHealth', label: 'Project Health', href: '/project-health' },
  { icon: 'auditHistory', label: 'Audit History', href: '/audit-history' },
  {
    icon: 'settings',
    label: 'Settings',
    href: '/settings',
    children: ['/settings/vehicle-categories', '/settings/commissions', '/settings/permissions'],
  },
];

// Operator - Acces limitat
const operatorMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/operator/dashboard' },
  {
    icon: 'users',
    label: 'My Drivers',
    href: '/operator/drivers',
    children: ['/operator/drivers'],
  },
  { icon: 'calendar', label: 'Bookings', href: '/bookings' },
  { icon: 'documents', label: 'Documents', href: '/documents' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'settings', label: 'Settings', href: '/settings/profile' }, // Settings limitat
];

/**
 * Obține meniul pentru rol specific
 */
export function getMenuForRole(role: UserRole): NavMenuItem[] {
  switch (role) {
    case 'admin':
      return adminMenu;
    case 'operator':
      return operatorMenu;
    default:
      return [];
  }
}

/**
 * Verifică dacă un path este activ pentru un menu item
 */
export function isMenuItemActive(item: NavMenuItem, currentPath: string): boolean {
  // Exact match
  if (item.href === currentPath) {
    return true;
  }

  // Check children paths
  if (item.children) {
    return item.children.includes(currentPath);
  }

  // Parent path match (e.g., /users pentru /users/drivers)
  return currentPath.startsWith(item.href + '/');
}

/**
 * Verifică dacă un menu item are children expanded
 */
export function isMenuItemExpanded(item: NavMenuItem, currentPath: string): boolean {
  if (!item.children) {
    return false;
  }

  return item.children.some(
    (childPath) => currentPath === childPath || currentPath.startsWith(childPath + '/')
  );
}
