/**
 * @vantage-lane/ui-core
 * Core UI primitives - Button, Input, Card, Checkbox
 * Theme System - Multi-brand color support
 */

// Components
export * from './ActionButton';
export * from './ActionMenu';
export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Card';
export * from './Checkbox';
export * from './components/NotificationBell';
export * from './components/StatusBadge';
export * from './ConfirmDialog';
export * from './DataTable';
export * from './FormField';
export * from './Icon';
export * from './Input';
export * from './LoginForm';
export * from './Modal';
export * from './NotificationActions';
export * from './Pagination';
export * from './ProfileSection';
export * from './RowActions';
export * from './SaveButton';
export * from './Select';
export * from './TableActions';
export * from './TableFilters';
export * from './TanStackTable';
export * from './Textarea';
export * from './ThemeSwitcher';
export * from './UserBadge';

// Rating Components
export * from './RatingBreakdown';
export * from './RatingDisplay';
export * from './SafetyBadge';

// Auth Components
export * from './AuthCard';
export * from './BrandBackground';
export * from './BrandName';
export * from './ErrorBanner';
export * from './FormRow';
export * from './LoadingState';

// Dashboard Cards
export * from './ActivityCard';
export * from './DonutCard';
export * from './MetricBarsCard';
export * from './MiniMetricCard';
export * from './ProgressCard';
export * from './StatCard';
export { TableCard } from './TableCard';
export type { TableCardProps, TableColumn } from './TableCard';
// Note: TableRow from TableCard excluded to avoid conflict with DataTable's TableRow component

// Advanced Charts (Recharts)
// REMOVED: export * from './charts';
// Charts must be imported directly from @vantage-lane/ui-core/charts to avoid bundling Recharts globally
// Example: import { BarChartPremium } from '@vantage-lane/ui-core/charts';

// Navigation
export * from './Tabs';

// Theme System
export * from './theme';

// Utilities
export * from './utils';
