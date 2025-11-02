/**
 * Icons - Design System Icon Set
 *
 * Migrated to lucide-react via adapter layer.
 * API unchanged for apps, zero breaking changes.
 */

import React from 'react';
import { makeLucide } from './_adapters/lucide';

// KEEP: Custom/Brand icons - import first
import { Payments } from './Payments';
import { Monitoring } from './Monitoring';
import { Assign } from './Assign';
import { ChevronDown } from './ChevronDown';
import { View } from './View';
import { Luggage } from './Luggage';
import { Cancel } from './Cancel';

// Re-export custom icons
export { Payments, Monitoring, Assign, ChevronDown, View, Luggage, Cancel };

// Lucide imports
import {
  User as LUser,
  Users as LUsers,
  UserPlus as LUserPlus,
  UserCheck as LUserCheck,
  Mail as LMail,
  Edit as LEdit,
  MoreHorizontal as LMore,
  Bell as LBell,
  Calendar as LCalendar,
  Clock as LClock,
  Copy as LCopy,
  CreditCard as LCreditCard,
  PoundSterling as LCurrency,
  LayoutDashboard as LDashboard,
  FileText as LDocuments,
  Download as LDownload,
  Eye as LEye,
  Menu as LMenu,
  Settings as LSettings,
  Headset as LSupport,
  Phone as LPhone,
  Plane as LPlane,
  Route as LRoute,
  BadgePercent as LRefunds,
  Car as LCar,
  Truck as LTruck,
  Bus as LBus,
  MapPin as LMapPin,
  Map as LMap,
  Circle as LCircle,
  Timer as LTimer,
  Hourglass as LHourglass,
  CheckCircle as LCheckCircle,
  XCircle as LXCircle,
  RefreshCw as LRefreshCw,
  ArrowRight as LArrowRight,
  DollarSign as LDollarSign,
  ClipboardList as LClipboardList,
  Sparkles as LSparkles,
  Hash as LHash,
  Wallet as LWallet,
  Scale as LScale,
  FileText as LFileText,
  Banknote as LBanknote,
  Receipt as LReceipt,
} from 'lucide-react';

// Lucide mappings
export const User = makeLucide(LUser);
export const Users = makeLucide(LUsers);
export const UserPlus = makeLucide(LUserPlus);
export const Email = makeLucide(LMail);
export const Edit = makeLucide(LEdit);
export const More = makeLucide(LMore);
export const Bell = makeLucide(LBell);
export const Calendar = makeLucide(LCalendar);
export const Clock = makeLucide(LClock);
export const Copy = makeLucide(LCopy);
export const CreditCard = makeLucide(LCreditCard);
export const Currency = makeLucide(LCurrency);
export const Dashboard = makeLucide(LDashboard);
export const Documents = makeLucide(LDocuments);
export const Download = makeLucide(LDownload);
export const Eye = makeLucide(LEye);
export const Menu = makeLucide(LMenu);
export const Settings = makeLucide(LSettings);
export const Support = makeLucide(LSupport);
export const Phone = makeLucide(LPhone);
export const Plane = makeLucide(LPlane);
export const Route = makeLucide(LRoute);
export const Refunds = makeLucide(LRefunds);
export const Car = makeLucide(LCar);
export const Truck = makeLucide(LTruck);
export const Bus = makeLucide(LBus);
export const MapPin = makeLucide(LMapPin);
export const Map = makeLucide(LMap);
export const Circle = makeLucide(LCircle);
export const Timer = makeLucide(LTimer);
export const Hourglass = makeLucide(LHourglass);
export const CheckCircle = makeLucide(LCheckCircle);
export const XCircle = makeLucide(LXCircle);
export const RefreshCw = makeLucide(LRefreshCw);
export const ArrowRight = makeLucide(LArrowRight);
export const DollarSign = makeLucide(LDollarSign);
export const ClipboardList = makeLucide(LClipboardList);
export const Sparkles = makeLucide(LSparkles);
export const Hash = makeLucide(LHash);
export const UserCheck = makeLucide(LUserCheck);
export const Wallet = makeLucide(LWallet);
export const Scale = makeLucide(LScale);
export const FileText = makeLucide(LFileText);
export const Banknote = makeLucide(LBanknote);
export const Receipt = makeLucide(LReceipt);

// Icon map pentru dynamic loading (MUST be after all exports)
const iconMap: Record<import('./types').IconName, React.ComponentType<any>> = {
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
  wallet: Wallet,
  scale: Scale,
  fileText: FileText,
  banknote: Banknote,
  receipt: Receipt,
  // Placeholders for missing icons
  disputes: Scale,
  payouts: Banknote,
  projectHealth: Dashboard,
  auditHistory: Dashboard,
  prices: Dashboard,
} as const;

/**
 * Icon Component - Dynamic loading with name prop
 */

export function Icon({ name, size = 24, className, 'aria-label': ariaLabel }: import('./types').IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    if (typeof window !== 'undefined') {
      console.warn(`Icon "${name}" not found in icon registry`);
    }
    return null;
  }

  const props: any = {
    size,
    ...(className && { className }),
    ...(ariaLabel && { 'aria-label': ariaLabel }),
  };

  return React.createElement(IconComponent, props);
}

// Export types
export type { IconProps } from './_adapters/lucide';
export type { BaseIconProps, IconName } from './types';
