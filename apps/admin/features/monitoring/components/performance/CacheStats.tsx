/**
 * Cache Stats Component
 * 
 * Cache performance statistics
 * Conform RULES.md: <30 linii
 */

'use client';

import { Card } from '@vantage-lane/ui-core';
import styles from './CacheStats.module.css';

interface CacheStatsProps {
  cache: {
    hitRate: number;
    missRate: number;
    totalRequests: number;
  } | null;
}

export function CacheStats({ cache }: CacheStatsProps): JSX.Element {
  return (
    <Card className={styles.cacheCard}>
      <h3 className={styles.cardTitle}>Cache Performance</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{cache?.hitRate || 0}%</span>
          <span className={styles.statLabel}>Hit Rate</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{cache?.missRate || 0}%</span>
          <span className={styles.statLabel}>Miss Rate</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{cache?.totalRequests || 0}</span>
          <span className={styles.statLabel}>Total Requests</span>
        </div>
      </div>
    </Card>
  );
}
