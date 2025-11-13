/**
 * Dashboard Feature - Barrel Export
 * 
 * Exports dashboard components and hooks.
 * Ver 2.4 - PAS 3
 */

export { default as DashboardPage } from './components/DashboardPage';
export { StatCard } from './components/StatCard';
export { ChartCard } from './components/ChartCard';
export { useDashboardCharts } from './hooks/useDashboardCharts';

export type { StatCardProps } from './components/StatCard';
export type { ChartCardProps } from './components/ChartCard';
export type { UseDashboardChartsReturn } from './hooks/useDashboardCharts';
