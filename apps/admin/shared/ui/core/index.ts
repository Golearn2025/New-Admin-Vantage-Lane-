/**
 * UI Core Components - FROZEN
 * 
 * These components are frozen and cannot be modified without freeze-exception.
 * All components use only design tokens - no inline colors or styles allowed.
 * 
 * Usage:
 * import { Button, Input, Card } from '@admin/shared/ui/core';
 */

// Basic Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Card } from './Card';
export type { CardProps } from './Card';

// TODO: Add remaining core components
// - IconButton, Select, Checkbox, Switch, Tooltip, Badge, Avatar
// - Tabs, Table, Pagination, FilterBar, DateRangePicker
// - Modal, Drawer, Toast, EmptyState, ErrorState, Skeleton, ConfirmDialog

// Component state types
export type ComponentState = 
  | 'default'
  | 'hover' 
  | 'focus'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error'
  | 'success'
  | 'warning';

// Common prop patterns
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface StatefulComponentProps extends BaseComponentProps {
  state?: ComponentState;
  disabled?: boolean;
  loading?: boolean;
}
