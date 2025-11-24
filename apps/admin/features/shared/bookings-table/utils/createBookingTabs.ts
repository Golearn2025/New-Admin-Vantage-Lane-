/**
 * Booking Tabs Configuration
 * 
 * Maps booking types to Tab[] format for ui-core/Tabs component
 * Uses Lucide React icons for professional appearance
 * 
 * Compliant: TypeScript strict, <50 lines per function
 */

import type { Tab } from '@vantage-lane/ui-core';

export type TabId =
  | 'all'
  | 'oneway'
  | 'return'
  | 'hourly'
  | 'daily'
  | 'fleet'
  | 'bespoke'
  | 'events'
  | 'corporate';

export type CountsByTripType = Record<TabId, number>;

export const ZERO_COUNTS: CountsByTripType = {
  all: 0,
  oneway: 0,
  return: 0,
  hourly: 0,
  daily: 0,
  fleet: 0,
  bespoke: 0,
  events: 0,
  corporate: 0,
};

export const TAB_ORDER: TabId[] = [
  'all',
  'oneway',
  'return',
  'hourly',
  'daily',
  'fleet',
  'bespoke',
  'events',
  'corporate',
];

const TAB_META: Record<TabId, { label: string; color: 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'magenta' | 'purple' | 'burnred' | 'lightblue' }> = {
  all: { label: 'All Bookings', color: 'magenta' },
  oneway: { label: 'One Way', color: 'info' },
  return: { label: 'Return', color: 'success' },
  hourly: { label: 'Hourly', color: 'danger' },
  daily: { label: 'Daily', color: 'warning' },
  fleet: { label: 'Fleet', color: 'burnred' },
  bespoke: { label: 'Bespoke', color: 'purple' },
  events: { label: 'Events', color: 'lightblue' },
  corporate: { label: 'Corporate', color: 'neutral' },
};

/**
 * Format large numbers compactly (1234 → 1.2k)
 */
function formatBadge(n: number): number | string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  }
  return n;
}

export function createBookingTabs(counts: CountsByTripType): Tab[] {
  return TAB_ORDER.map((id) => ({
    id,
    label: TAB_META[id].label,
    badge: formatBadge(counts[id]),
    badgeColor: TAB_META[id].color, // Badge color
    tabColor: TAB_META[id].color,   // Tab background color - same as badge
  }));
}
