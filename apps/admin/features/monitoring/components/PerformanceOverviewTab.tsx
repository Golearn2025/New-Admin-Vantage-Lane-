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
      <div className={styles.loading || ""}>
        <div className={styles.spinner || ""}></div>
        <p>Loading performance data...</p>
      </div>
    );
  }

  // Convert PerformanceMetric[] to expected format
  const convertedMetrics = {
    averageResponseTime: metrics.find(m => m.name === 'averageResponseTime')?.value || 0,
    throughput: metrics.find(m => m.name === 'throughput')?.value || 0,
    errorRate: metrics.find(m => m.name === 'errorRate')?.value || 0,
    apdex: metrics.find(m => m.name === 'apdex')?.value || 0,
  };

  // Convert Record<string, unknown> to expected cache format
  const convertedCache = {
    hitRate: (cache.hitRate as number) || 0,
    missRate: 100 - ((cache.hitRate as number) || 0),
    totalRequests: (cache.totalRequests as number) || 0,
  };

  return (
    <div className={styles.container || ""}>
      <PerformanceMetrics metrics={convertedMetrics} />
      <SlowQueries queries={queries} />
      <CacheStats cache={convertedCache} />
    </div>
  );
}
