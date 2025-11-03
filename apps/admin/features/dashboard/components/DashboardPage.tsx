/**
 * Dashboard Page Component
 *
 * Orchestration only - delegates to hooks and presentational components.
 * 100% mobile-responsive, lazy-loaded charts, no inline logic.
 *
 * Ver 2.4 - PAS 3
 */

'use client';

import { DASHBOARD_CARDS } from '@admin-shared/config/dashboard.cards';
import { determineChartGrouping } from '@admin-shared/utils/chartGrouping';
import { DashboardMetrics } from '@admin/dashboard/feature';
import { Select } from '@vantage-lane/ui-core';
import type { DatePreset } from '@vantage-lane/ui-dashboard';
import { DateRangePicker, useDateRangeOrchestrator } from '@vantage-lane/ui-dashboard';
import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import { useDashboardCharts } from '../hooks/useDashboardCharts';
import { ChartCard } from './ChartCard';
import styles from './DashboardPage.module.css';

// Lazy load chart components (reduce initial bundle)
const BarBasic = dynamic(
  () => import('@vantage-lane/ui-dashboard').then((m) => ({ default: m.BarBasic })),
  { ssr: false }
);
const LineChart = dynamic(
  () => import('@vantage-lane/ui-dashboard').then((m) => ({ default: m.LineChart })),
  { ssr: false }
);
const StackedBarChart = dynamic(
  () => import('@vantage-lane/ui-dashboard').then((m) => ({ default: m.StackedBarChart })),
  { ssr: false }
);
const DonutChart = dynamic(
  () => import('@vantage-lane/ui-dashboard').then((m) => ({ default: m.DonutChart })),
  { ssr: false }
);

const DATE_PRESET_TABS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 Days' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_year', label: 'This Year' },
  { id: 'all_time', label: 'All Time' },
  { id: 'custom', label: 'Custom Range' },
] as const;

export default function DashboardPage() {
  // ORCHESTRATOR - MASTER date filter management
  const { preset, effectiveRange, setPreset, setCustomRange, apiParams } =
    useDateRangeOrchestrator('last_30_days');

  // Determine optimal chart grouping based on date range
  const grouping = determineChartGrouping(effectiveRange);

  // Create select options for date presets
  const dateFilterOptions = useMemo(
    () =>
      DATE_PRESET_TABS.map((tab) => ({
        label: tab.label,
        value: tab.id,
      })),
    []
  );

  // Handle preset change
  const handlePresetChange = useCallback(
    (value: string | number) => {
      setPreset(value as DatePreset);
    },
    [setPreset]
  );

  // Build API URL with date params
  const apiSearchParams = new URLSearchParams({
    ...apiParams,
    grouping: grouping.sqlGroup,
  });

  // Fetch and transform dashboard data
  const { data: convertedCharts, isLoading } = useDashboardCharts(apiSearchParams);

  // Memoize status distribution data transformation
  const statusDistributionData = useMemo(() => {
    if (!convertedCharts) return [];
    return convertedCharts.status_distribution.map((item) => ({
      name: item.name,
      value: item.value,
      color: item.name === 'COMPLETED' ? 'var(--chart-series-positive)' : 'var(--chart-series-3)',
    }));
  }, [convertedCharts]);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* Date Filters - Using Select Dropdown */}
      <div className={styles.filtersContainer}>
        <Select
          value={preset}
          options={dateFilterOptions}
          onChange={handlePresetChange}
          placeholder="Select period"
        />

        {preset === 'custom' && (
          <DateRangePicker value={effectiveRange} onChange={(range) => setCustomRange(range)} />
        )}

        <div className={styles.groupingInfo}>
          Grouping: <strong>{grouping.label}</strong> ({grouping.expectedPoints} points)
        </div>
      </div>

      {/* Metric Cards - Real Data from Supabase */}
      <DashboardMetrics
        specs={DASHBOARD_CARDS}
        startDate={apiParams.start_date}
        endDate={apiParams.end_date}
      />

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <ChartCard title="Weekly Activity" loading={isLoading}>
          {convertedCharts && (
            <BarBasic data={convertedCharts.weekly_activity} color="var(--chart-series-1)" />
          )}
        </ChartCard>

        <ChartCard title="Revenue Trend (£)" loading={isLoading}>
          {convertedCharts && (
            <LineChart data={convertedCharts.revenue_trend} color="var(--chart-series-2)" />
          )}
        </ChartCard>
      </div>

      <div className={styles.chartsGrid}>
        <ChartCard title="Operator Performance" loading={isLoading}>
          {convertedCharts && (
            <StackedBarChart
              data={convertedCharts.operator_performance}
              series={[
                { key: 'bookings', label: 'Bookings', color: 'var(--chart-series-1)' },
                { key: 'revenue', label: 'Revenue (£)', color: 'var(--chart-series-2)' },
                { key: 'commission', label: 'Commission (£)', color: 'var(--chart-series-3)' },
              ]}
            />
          )}
        </ChartCard>

        <ChartCard title="Booking Status" loading={isLoading}>
          {convertedCharts && <DonutChart data={statusDistributionData} />}
        </ChartCard>
      </div>
    </div>
  );
}
