/**
 * Dashboard Specification - Centralized Config
 * Spec-driven architecture for cards and charts
 *
 * This file re-exports all dashboard configurations
 * for easy imports: import { DASHBOARD_CARDS, DASHBOARD_CHARTS } from '@admin-shared/config/dashboard.spec'
 */

// Re-export types
export type {
  WindowPreset,
  CardUnit,
  CardFormat,
  ChartType,
  CardSpec,
  ChartSpec,
} from './dashboard.types';

// Re-export cards
export { DASHBOARD_CARDS } from './dashboard.cards';

// Re-export charts
export { DASHBOARD_CHARTS } from './dashboard.charts';

// Window presets configuration
import type { WindowPreset } from './dashboard.types';

export const WINDOW_PRESETS: Record<WindowPreset, { label: string; description: string }> = {
  today: { label: 'Today', description: 'Current day' },
  yesterday: { label: 'Yesterday', description: 'Previous day' },
  this_week: { label: 'This Week', description: 'Current week' },
  last_week: { label: 'Last Week', description: 'Previous week' },
  this_month: { label: 'This Month', description: 'Current month' },
  last_month: { label: 'Last Month', description: 'Previous month' },
  this_year: { label: 'This Year', description: 'Current year' },
  all: { label: 'All Time', description: 'All available data' },
  custom: { label: 'Custom Range', description: 'Select date range' },
};
