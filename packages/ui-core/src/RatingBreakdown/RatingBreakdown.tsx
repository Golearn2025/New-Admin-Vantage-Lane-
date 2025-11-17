/**
 * RatingBreakdown Component
 * 
 * Uber-style rating breakdown cu bare și percentaje.
 * 100% design tokens, fully responsive.
 */

'use client';

import React from 'react';
import { Star } from 'lucide-react';
import styles from './RatingBreakdown.module.css';

interface RatingBreakdownData {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  totalRatings: number;
  averageRating: number;
}

export interface RatingBreakdownProps {
  /** Rating breakdown data */
  data: RatingBreakdownData;
  /** Display size */
  size?: 'sm' | 'md';
  /** Additional CSS class */
  className?: string;
}

export function RatingBreakdown({
  data,
  size = 'md',
  className,
}: RatingBreakdownProps) {
  const { totalRatings } = data;

  // Calculează percentajele
  const calculatePercentage = (count: number): number => {
    return totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
  };

  const breakdown = [
    { stars: 5, count: data.fiveStars, percentage: calculatePercentage(data.fiveStars) },
    { stars: 4, count: data.fourStars, percentage: calculatePercentage(data.fourStars) },
    { stars: 3, count: data.threeStars, percentage: calculatePercentage(data.threeStars) },
    { stars: 2, count: data.twoStars, percentage: calculatePercentage(data.twoStars) },
    { stars: 1, count: data.oneStar, percentage: calculatePercentage(data.oneStar) },
  ];

  const containerClasses = [
    styles.container,
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (totalRatings === 0) {
    return (
      <div className={containerClasses}>
        <div className={styles.emptyState}>
          <Star size={24} className={styles.emptyStar} />
          <span className={styles.emptyText}>No ratings yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={styles.header}>
        <div className={styles.average}>
          <span className={styles.averageValue}>
            {data.averageRating.toFixed(2)}
          </span>
          <div className={styles.starsContainer}>
            <Star size={16} fill="currentColor" className={styles.star} />
          </div>
        </div>
        <div className={styles.total}>
          <span className={styles.totalCount}>
            {totalRatings.toLocaleString()} ratings
          </span>
        </div>
      </div>

      <div className={styles.breakdown}>
        {breakdown.map(({ stars, count, percentage }) => (
          <div key={stars} className={styles.row}>
            <div className={styles.label}>
              {stars} <Star size={12} fill="currentColor" className={styles.rowStar} />
            </div>
            
            <div className={styles.barContainer}>
              <div 
                className={styles.barFill}
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: `var(--color-warning-${stars === 5 ? '500' : stars >= 4 ? '400' : stars >= 3 ? '300' : '200'})`,
                }}
                aria-label={`${percentage}% of ratings`}
              />
            </div>
            
            <div className={styles.count}>
              {count.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

RatingBreakdown.displayName = 'RatingBreakdown';
