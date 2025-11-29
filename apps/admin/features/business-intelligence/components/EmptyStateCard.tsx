/**
 * EmptyStateCard Component
 *
 * Reusable empty state with industry benchmarks and tips.
 * File: < 200 lines (RULES.md compliant)
 */

import React, { useMemo } from 'react';
import { Card, Icon, Badge } from '@vantage-lane/ui-core';
import { getEmptyStateMessage, getIndustryBenchmarks } from '@entities/business-intelligence';
import type { IconName } from '@vantage-lane/ui-core';
import styles from './EmptyStateCard.module.css';

interface EmptyStateCardProps {
  type: 'bookings' | 'routes' | 'drivers' | 'revenue' | 'peakHours';
  icon: IconName;
  title: string;
}

export function EmptyStateCard({ type, icon, title }: EmptyStateCardProps) {
  const message = getEmptyStateMessage(type);
  const benchmarks = getIndustryBenchmarks(type);

  // Memoize benchmark items to prevent re-creation on every render
  const benchmarkItems = useMemo(() => 
    benchmarks.map((benchmark, index) => (
      <li key={index} className={styles.benchmarkItem}>
        <Icon name="check" size="sm" />
        <span>{benchmark}</span>
      </li>
    )), 
    [benchmarks]
  );

  return (
    <Card className={styles.emptyStateCard || ''}>
      <div className={styles.emptyStateContent}>
        {/* Main Icon */}
        <div className={styles.iconContainer}>
          <Icon name={icon} size="lg" />
        </div>

        {/* Title & Description */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{message}</p>
        </div>

        {/* Industry Benchmarks */}
        {benchmarks.length > 0 && (
          <div className={styles.benchmarks}>
            <div className={styles.benchmarksHeader}>
              <Icon name="star" size="sm" />
              <span className={styles.benchmarksTitle}>Industry Insights</span>
            </div>
            
            <ul className={styles.benchmarksList}>
              {benchmarkItems}
            </ul>
          </div>
        )}

        {/* Call to Action */}
        <div className={styles.callToAction}>
          <Badge color="info" variant="solid">
            <Icon name="star" size="sm" />
            <span>Data will appear automatically here</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
