/**
 * ActionMenu Types
 *
 * Type definitions for dropdown action menu component.
 * NO BUSINESS LOGIC - Only UI props.
 */

import { ReactNode } from 'react';

export interface ActionMenuItem {
  /** Separator item (no icon, label, or onClick) */
  separator?: boolean;

  /** Icon element (SVG component) */
  icon?: ReactNode;

  /** Menu item label */
  label?: string;

  /** Click handler - NO business logic here */
  onClick?: () => void;

  /** Disabled state */
  disabled?: boolean;

  /** Danger action (red styling) */
  danger?: boolean;

  /** Show divider after this item */
  divider?: boolean;
}

export interface ActionMenuProps {
  /** Trigger element (usually a button) */
  trigger: ReactNode;

  /** Menu items array */
  items: ActionMenuItem[];

  /** Menu position relative to trigger */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  /** Additional CSS class */
  className?: string;
}
