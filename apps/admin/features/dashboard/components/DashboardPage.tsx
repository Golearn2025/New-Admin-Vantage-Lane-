/**
 * Dashboard Page Component
 * 
 * Main dashboard with metrics, filters, and charts
 * Business logic moved from app/ to feature
 */

'use client';

import {
  BarBasic,
  LineChart,
  StackedBarChart,
  DonutChart,
  DateFilterPreset,
  DateRangePicker,
} from '@vantage-lane/ui-dashboard';
import { DASHBOARD_CARDS } from '@admin-shared/config/dashboard.cards';
import { DashboardMetrics } from '@admin/dashboard/feature';
import { useDateFilter } from '@admin-shared/hooks/useDateFilter';
import { determineChartGrouping } from '@admin-shared/utils/chartGrouping';
import { useDashboardData } from '../hooks/useDashboardData';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  // Date filter state management
  const { dateRange, preset, setPreset, setCustomRange, getAPIParams } =
    useDateFilter('last_30_days');

  // Determine optimal chart grouping based on date range
  const grouping = determineChartGrouping(dateRange);

  // Build API URL with date params
  const apiParams = new URLSearchParams({
    ...getAPIParams(),
    grouping: grouping.sqlGroup,
  });

  // Fetch and transform dashboard data
  const { data: convertedCharts, isLoading } = useDashboardData(apiParams);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here&apos;s your business overview.</p>
        </div>
      </div>

      {/* Date Filters */}
      <div className={styles.filtersContainer}>
        <DateFilterPreset
          value={preset}
          onChange={(newPreset) => setPreset(newPreset)}
          presets={[
            'today',
            'yesterday',
            'last_7_days',
            'last_30_days',
            'this_month',
            'last_month',
            'this_year',
            'all_time',
          ]}
          variant="default"
          showCustom={true}
        />
        <DateRangePicker value={dateRange} onChange={(range) => setCustomRange(range)} />
        <div className={styles.groupingInfo}>
          Grouping: <strong>{grouping.label}</strong> ({grouping.expectedPoints} points)
        </div>
      </div>

      {/* Metric Cards - Real Data from Supabase */}
      <DashboardMetrics
        specs={DASHBOARD_CARDS}
        startDate={getAPIParams().start_date}
        endDate={getAPIParams().end_date}
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
                height={280}
                color="var(--vl-chart-primary)"
              />
            </div>

            {/* Revenue Trend */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Revenue Trend (£)</h3>
              <LineChart
                data={convertedCharts.revenue_trend || []}
                height={280}
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
                data={convertedCharts.operator_performance as any || []}
                series={[
                  { key: 'bookings', label: 'Bookings', color: 'var(--vl-chart-primary)' },
                  { key: 'revenue', label: 'Revenue (£)', color: 'var(--vl-chart-success)' },
                  { key: 'commission', label: 'Commission (£)', color: 'var(--vl-chart-warning)' },
                ]}
                height={280}
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
                height={280}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
