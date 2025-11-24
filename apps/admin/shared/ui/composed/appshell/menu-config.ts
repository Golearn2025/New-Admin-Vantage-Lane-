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
    children: [
      '/users/all',
      '/users/drivers',
      '/users/drivers/pending',
      '/users/customers',
      '/users/operators',
      '/users/admins',
      '/users/assign-drivers-to-operators',
      '/users/trash',
    ],
  },
  { icon: 'documents', label: 'Documents', href: '/documents' },
  { icon: 'bell', label: 'Notifications', href: '/notifications' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'star', label: 'Reviews', href: '/reviews' },
  { icon: 'prices', label: 'Prices', href: '/prices' },
  {
    icon: 'wallet',
    label: 'Payments',
    href: '/payments',
    children: ['/payments', '/payments/transactions', '/payments/refunds', '/payments/disputes'],
  },
  { icon: 'fileText', label: 'Invoices', href: '/invoices' },
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

// Operator - Acces limitat (folosește aceleași pagini ca admin, doar meniul e filtrat)
const operatorMenu: NavMenuItem[] = [
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
    children: [
      '/users/drivers',         // ✅ DOAR Drivers (șoferii asignați la operator)
      '/users/drivers/pending', // ✅ Documentele pending ale șoferilor lor
    ],
  },
  { icon: 'documents', label: 'Documents', href: '/documents' }, // ✅ Documentele șoferilor lor + approve/reject
  { icon: 'bell', label: 'Notifications', href: '/notifications' }, // ✅ Trimite la admini + șoferii lor + istoricul său
  { icon: 'support', label: 'Support', href: '/support-tickets' }, // ✅ Toate ticketele de la toți șoferii
  { icon: 'settings', label: 'Settings', href: '/settings/profile' },
];

// Driver - Portal dedicat pentru șoferi
const driverMenu: NavMenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  {
    icon: 'calendar',
    label: 'My Trips',
    href: '/driver/trips',
    children: ['/driver/trips/active', '/driver/trips/upcoming', '/driver/trips/completed'],
  },
  { icon: 'documents', label: 'Documents', href: '/driver/documents' },
  { icon: 'wallet', label: 'Earnings', href: '/driver/earnings' },
  { icon: 'support', label: 'Support', href: '/support-tickets' },
  { icon: 'settings', label: 'Profile', href: '/driver/profile' },
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
    case 'driver':
      return driverMenu;
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
