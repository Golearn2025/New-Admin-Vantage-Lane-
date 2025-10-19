/**
 * Icons - Design System Icon Set
 * 
 * Tree-shakable SVG icons pentru Vantage Lane Admin.
 * Consistent style: 24x24, stroke 1.5, currentColor.
 */

import React from 'react';
import { IconProps, BaseIconProps } from './types';

// Import toate componentele
import { Dashboard } from './Dashboard';
import { Calendar } from './Calendar';
import { Users } from './Users';
import { Documents } from './Documents';
import { Support } from './Support';
import { Payments } from './Payments';
import { Settings } from './Settings';
import { Menu } from './Menu';
import { ChevronDown } from './ChevronDown';
import { Monitoring } from './Monitoring';
import { Refunds } from './Refunds';

// Icon map pentru dynamic loading
const iconMap = {
  dashboard: Dashboard,
  calendar: Calendar,
  users: Users,
  documents: Documents,
  support: Support,
  payments: Payments,
  settings: Settings,
  menu: Menu,
  chevronDown: ChevronDown,
  monitoring: Monitoring,
  refunds: Refunds,
  // TODO: Adăugă restul iconițelor când sunt create
  disputes: Dashboard, // Placeholder
  payouts: Dashboard,
  projectHealth: Dashboard,
  auditHistory: Dashboard,
  prices: Dashboard,
  creditCard: Payments,
  banknote: Dashboard,
} as const;

/**
 * Icon Component - Reutilizabil cu name prop
 */
export function Icon({ name, size = 24, className, 'aria-label': ariaLabel }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    // eslint-disable-next-line no-console -- Library code: warn about missing icons in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Icon "${name}" not found in icon registry`);
    }
    return null;
  }
  
  const props: BaseIconProps = {
    size,
    ...(className && { className }),
    ...( ariaLabel && { 'aria-label': ariaLabel }),
  };

  return React.createElement(IconComponent, props);
}

// Export types
export type { IconName, IconProps, BaseIconProps } from './types';

// Export individual components pentru tree-shaking
export {
  Dashboard,
  Calendar,
  Users,
  Documents,
  Support,
  Payments,
  Settings,
  Menu,
  ChevronDown,
  Monitoring,
  Refunds,
};
