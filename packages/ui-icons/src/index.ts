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
import { Edit } from './Edit';
import { Assign } from './Assign';
import { View } from './View';
import { Email } from './Email';
import { Phone } from './Phone';
import { More } from './More';
import { Cancel } from './Cancel';
import { Clock } from './Clock';
import { Plane } from './Plane';
import { Route } from './Route';
import { User } from './User';
import { Luggage } from './Luggage';
import { CreditCard } from './CreditCard';
import { Currency } from './Currency';
import { UserPlus } from './UserPlus';
import { Eye } from './Eye';
import { Download } from './Download';
import { Copy } from './Copy';
import { Bell } from './Bell';

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
  clock: Clock,
  plane: Plane,
  route: Route,
  user: User,
  luggage: Luggage,
  creditCard: CreditCard,
  currency: Currency,
  userPlus: UserPlus,
  eye: Eye,
  download: Download,
  copy: Copy,
  bell: Bell,
  // TODO: Adăugă restul iconițelor când sunt create
  disputes: Dashboard, // Placeholder
  payouts: Dashboard,
  projectHealth: Dashboard,
  auditHistory: Dashboard,
  prices: Dashboard,
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
    ...(ariaLabel && { 'aria-label': ariaLabel }),
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
  Edit,
  Assign,
  View,
  Email,
  Phone,
  More,
  Cancel,
  Clock,
  Plane,
  Route,
  User,
  Luggage,
  CreditCard,
  Currency,
  UserPlus,
  Eye,
  Download,
  Copy,
  Bell,
};
