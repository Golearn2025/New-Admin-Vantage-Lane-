/**
 * Booking Tabs Types
 * 
 * Compliant:
 * - TypeScript Strict (zero any)
 * - Complete interfaces
 * - Enum for tab values
 */

export type BookingTabValue = 
  | 'all'
  | 'oneway'
  | 'return'
  | 'hourly'
  | 'fleet'
  | 'by_request'
  | 'events'
  | 'corporate';

export interface BookingTab {
  value: BookingTabValue;
  label: string;
  icon?: string;
  count: number;
}

export interface BookingTabsProps {
  activeTab: BookingTabValue;
  onTabChange: (tab: BookingTabValue) => void;
  tabs: BookingTab[];
  isLoading?: boolean;
}

export interface BookingCounts {
  all: number;
  oneway: number;
  return: number;
  hourly: number;
  fleet: number;
  by_request: number;
  events: number;
  corporate: number;
}
