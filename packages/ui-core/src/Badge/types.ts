/**
 * Badge Component Types
 *
 * Type definitions pentru Badge component.
 * 100% type-safe, zero any!
 */

// Badge variant types
export type BadgeVariant =
  | 'status' // Driver workflow status
  | 'booking_status' // Booking lifecycle status
  | 'trip_type' // Trip type (oneway, return, etc.)
  | 'category' // Service category (EXEC, LUX, etc.)
  | 'service' // Extra service type
  | 'payment'; // Payment status

// Status values (Driver Workflow)
export type BadgeStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Booking status values (Lifecycle)
export type BadgeBookingStatus = 'draft' | 'confirmed' | 'active' | 'completed' | 'cancelled';

// Trip type values
export type BadgeTripType = 'oneway' | 'return' | 'hourly' | 'fleet';

// Category values (Service Type)
export type BadgeCategory = 'EXEC' | 'LUX' | 'SUV' | 'VAN';

// Service values
export type BadgeService = 'paid' | 'free' | 'security' | 'luxury';

// Payment status values
export type BadgePaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';

// Size options
export type BadgeSize = 'sm' | 'md' | 'lg';

// Badge props interface
export interface BadgeProps {
  /**
   * Badge variant - determines color scheme
   */
  variant: BadgeVariant;

  /**
   * Value to display
   * Must match the variant type (e.g., 'NEW' for status variant)
   */
  value: string;

  /**
   * Size of the badge
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

// Helper type for variant-specific values
export type BadgeValueByVariant<T extends BadgeVariant> = T extends 'status'
  ? BadgeStatus
  : T extends 'booking_status'
    ? BadgeBookingStatus
    : T extends 'trip_type'
      ? BadgeTripType
      : T extends 'category'
        ? BadgeCategory
        : T extends 'service'
          ? BadgeService
          : T extends 'payment'
            ? BadgePaymentStatus
            : string;

// Display labels mapping
export const BADGE_LABELS: Record<string, string> = {
  // Status
  NEW: 'New',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',

  // Booking Status
  draft: 'Draft',
  confirmed: 'Confirmed',
  active: 'Active',

  // Trip Type
  oneway: 'One Way',
  return: 'Return',
  hourly: 'Hourly',
  fleet: 'Fleet',

  // Category
  EXEC: 'Executive',
  LUX: 'Luxury',
  SUV: 'SUV',
  VAN: 'Van',

  // Service
  paid: 'Paid',
  free: 'Free',
  security: 'Security',
  luxury: 'Luxury',

  // Payment
  pending: 'Pending',
  authorized: 'Authorized',
  captured: 'Captured',
  refunded: 'Refunded',
  failed: 'Failed',
};
