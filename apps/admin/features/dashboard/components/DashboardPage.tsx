/**
 * Dashboard Page Component
 * 
 * Main dashboard with metrics, filters, and charts
 * Business logic moved from app/ to feature
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Tabs } from '@vantage-lane/ui-core';
import {
  BarBasic,
  LineChart,
  StackedBarChart,
  DonutChart,
  DateRangePicker,
  useDateRangeOrchestrator,
} from '@vantage-lane/ui-dashboard';
import { DASHBOARD_CARDS } from '@admin-shared/config/dashboard.cards';
import { DashboardMetrics } from '@admin/dashboard/feature';
import { determineChartGrouping } from '@admin-shared/utils/chartGrouping';
import { useDashboardData } from '../hooks/useDashboardData';
import type { DatePreset } from '@vantage-lane/ui-dashboard';
import styles from './DashboardPage.module.css';

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

  // Create tabs for date presets
  const dateFilterTabs = useMemo(() => 
    DATE_PRESET_TABS.map(tab => ({
      id: tab.id,
      label: tab.label,
    })),
    []
  );

  // Handle tab change
  const handlePresetChange = useCallback((tabId: string) => {
    setPreset(tabId as DatePreset);
  }, [setPreset]);

  // Build API URL with date params
  const apiSearchParams = new URLSearchParams({
    ...apiParams,
    grouping: grouping.sqlGroup,
  });

  // Fetch and transform dashboard data
  const { data: convertedCharts, isLoading } = useDashboardData(apiSearchParams);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* Date Filters - Using Tabs (same as Bookings) */}
      <div className={styles.filtersContainer}>
        <Tabs
          tabs={dateFilterTabs}
          activeTab={preset}
          onChange={handlePresetChange}
          variant="pills"
          fullWidth={false}
        />
        
        {preset === 'custom' && (
          <DateRangePicker 
            value={effectiveRange} 
            onChange={(range) => setCustomRange(range)} 
          />
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
      {!isLoading && convertedCharts && (
        <>
          <div className={styles.chartsGrid}>
            {/* Weekly Activity */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Weekly Activity</h3>
              <BarBasic
                data={convertedCharts.weekly_activity || []}
                color="var(--vl-chart-primary)"
              />
            </div>

            {/* Revenue Trend */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Revenue Trend (£)</h3>
              <LineChart
                data={convertedCharts.revenue_trend || []}
                color="var(--vl-chart-success)"
              />
            </div>
          </div>

          {/* Secondary Charts Grid */}
          <div className={styles.chartsGrid}>
            {/* Operator Performance */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Operator Performance</h3>
              <StackedBarChart
                data={convertedCharts.operator_performance || []}
                series={[
                  { key: 'bookings', label: 'Bookings', color: 'var(--vl-chart-primary)' },
                  { key: 'revenue', label: 'Revenue (£)', color: 'var(--vl-chart-success)' },
                  { key: 'commission', label: 'Commission (£)', color: 'var(--vl-chart-warning)' },
                ]}
              />
            </div>

            {/* Booking Status */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Booking Status</h3>
              <DonutChart
                data={(convertedCharts.status_distribution || []).map(
                  (item: { name: string; value: number }) => ({
                    name: item.name,
                    value: item.value,
                    color:
                      item.name === 'COMPLETED'
                        ? 'var(--vl-chart-success)'
                        : 'var(--vl-chart-warning)',
                  })
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
