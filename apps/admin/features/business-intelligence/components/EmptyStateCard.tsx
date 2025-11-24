/**
 * EmptyStateCard Component
 *
 * Reusable empty state with industry benchmarks and tips.
 * File: < 200 lines (RULES.md compliant)
 */

import React from 'react';
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

  return (
    <Card className={styles.emptyState || ''}>
      <div className={styles.emptyStateContent}>
        {/* Icon */}
        <div className={styles.iconContainer}>
          <Icon name={icon} size="lg" />
        </div>

        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Message */}
        <p className={styles.message}>{message}</p>

        {/* Industry Benchmarks */}
        {benchmarks.length > 0 && (
          <div className={styles.benchmarks}>
            <div className={styles.benchmarksHeader}>
              <Icon name="star" size="sm" />
              <span className={styles.benchmarksTitle}>Industry Insights</span>
            </div>
            
            <ul className={styles.benchmarksList}>
              {benchmarks.map((benchmark, index) => (
                <li key={index} className={styles.benchmarkItem}>
                  <Icon name="check" size="sm" />
                  <span>{benchmark}</span>
                </li>
              ))}
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
