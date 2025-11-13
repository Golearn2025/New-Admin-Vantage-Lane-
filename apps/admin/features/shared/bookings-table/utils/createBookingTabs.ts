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
  | 'fleet'
  | 'by_request'
  | 'events'
  | 'corporate';

export type CountsByTripType = Record<TabId, number>;

export const ZERO_COUNTS: CountsByTripType = {
  all: 0,
  oneway: 0,
  return: 0,
  hourly: 0,
  fleet: 0,
  by_request: 0,
  events: 0,
  corporate: 0,
};

export const TAB_ORDER: TabId[] = [
  'all',
  'oneway',
  'return',
  'hourly',
  'fleet',
  'by_request',
  'events',
  'corporate',
];

const TAB_META: Record<TabId, { label: string }> = {
  all: { label: 'All Bookings' },
  oneway: { label: 'One Way' },
  return: { label: 'Return' },
  hourly: { label: 'Hourly' },
  fleet: { label: 'Fleet' },
  by_request: { label: 'By Request' },
  events: { label: 'Events' },
  corporate: { label: 'Corporate' },
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
    badgeColor: 'theme' as const,
  }));
}
