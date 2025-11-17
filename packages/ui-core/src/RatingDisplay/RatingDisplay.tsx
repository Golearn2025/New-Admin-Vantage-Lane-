/**
 * RatingDisplay Component
 * 
 * Reusable rating display cu stele și decimale.
 * 100% design tokens, zero hardcode.
 * Responsive și accessible.
 */

'use client';

import React from 'react';
import { Star } from 'lucide-react';
import styles from './RatingDisplay.module.css';

export interface RatingDisplayProps {
  /** Rating value (1.00 - 5.00) */
  rating: number | null | undefined;
  /** Total number of ratings */
  totalRatings?: number;
  /** Display size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show stars visually */
  showStars?: boolean;
  /** Show rating count */
  showCount?: boolean;
  /** Show "New" label for users without ratings */
  showNewLabel?: boolean;
  /** Additional CSS class */
  className?: string;
}

export function RatingDisplay({
  rating,
  totalRatings = 0,
  size = 'md',
  showStars = true,
  showCount = true,
  showNewLabel = true,
  className,
}: RatingDisplayProps) {
  // Format rating cu 2 decimale
  const formatRating = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return '5.00'; // Default pentru useri noi
    }
    const clampedRating = Math.max(1.0, Math.min(5.0, value));
    return clampedRating.toFixed(2);
  };

  // Calculează câte stele sunt filled
  const getStarsFilled = (value: number | null | undefined): number => {
    if (value === null || value === undefined) return 5;
    return Math.max(1, Math.min(5, Math.round(value)));
  };

  const ratingValue = rating !== null && rating !== undefined ? rating : 5.0;
  const formattedRating = formatRating(rating);
  const starsFilled = getStarsFilled(rating);
  const isNewUser = totalRatings === 0;

  // CSS classes
  const containerClasses = [
    styles.container,
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Stars visual display */}
      {showStars && (
        <div className={styles.stars} aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16}
              className={
                index < starsFilled 
                  ? styles.starFilled 
                  : styles.starEmpty
              }
              fill="currentColor"
            />
          ))}
        </div>
      )}

      {/* Rating value */}
      <span 
        className={styles.rating}
        aria-label={`Rating ${formattedRating} out of 5 stars`}
      >
        {formattedRating}
      </span>

      {/* Rating count or New label */}
      {showCount && (
        <span className={styles.count}>
          {isNewUser && showNewLabel ? (
            <span className={styles.newLabel}>New</span>
          ) : (
            `(${totalRatings.toLocaleString()})`
          )}
        </span>
      )}
    </div>
  );
}

RatingDisplay.displayName = 'RatingDisplay';
