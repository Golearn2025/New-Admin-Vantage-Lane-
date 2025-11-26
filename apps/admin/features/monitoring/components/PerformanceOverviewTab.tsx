/**
 * Performance Overview Tab
 * 
 * Performance monitoring cu real Sentry data
 * Conform RULES.md: <50 linii, single responsibility
 */

'use client';

import { PerformanceMetrics } from './performance/PerformanceMetrics';
import { SlowQueries } from './performance/SlowQueries';
import { CacheStats } from './performance/CacheStats';
import { usePerformanceData } from '../hooks/usePerformanceData';
import styles from './PerformanceOverviewTab.module.css';

export function PerformanceOverviewTab(): JSX.Element {
  const { metrics, queries, cache, loading } = usePerformanceData();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PerformanceMetrics metrics={metrics} />
      <SlowQueries queries={queries} />
      <CacheStats cache={cache} />
    </div>
  );
}
