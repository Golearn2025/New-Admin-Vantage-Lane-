/**
 * Icon Types - Design System Icons
 * 
 * Toate iconițele disponibile în aplicație.
 * Tree-shakable, consistent style (24x24, stroke 1.5).
 */

export type IconName =
  | 'dashboard'
  | 'calendar'
  | 'users'
  | 'documents'
  | 'support'
  | 'payments'
  | 'refunds'
  | 'disputes'
  | 'payouts'
  | 'monitoring'
  | 'projectHealth'
  | 'auditHistory'
  | 'settings'
  | 'prices'
  | 'creditCard'
  | 'banknote'
  | 'chevronDown'
  | 'menu';

export interface BaseIconProps {
  size?: number;
  className?: string | undefined;
  'aria-label'?: string | undefined;
}

export interface IconProps extends BaseIconProps {
  name: IconName;
}
