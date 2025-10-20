/**
 * ActionButton Types
 *
 * Type definitions for reusable action button component.
 * NO BUSINESS LOGIC - Only UI props.
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';

export type ActionButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ActionButtonSize = 'sm' | 'md';

export interface ActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual variant - NO conditional logic based on status */
  variant?: ActionButtonVariant;

  /** Button size */
  size?: ActionButtonSize;

  /** Icon element (SVG component) - optional for text-only buttons */
  icon?: ReactNode;

  /** Button label text - optional for icon-only buttons */
  label?: string;

  /** Loading state */
  loading?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Full width in container */
  fullWidth?: boolean;

  /** Additional CSS class */
  className?: string;
}
