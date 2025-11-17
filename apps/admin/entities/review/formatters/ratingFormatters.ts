/**
 * Rating Formatters - Centralized Display Logic
 * 
 * Reusable formatters pentru rating displays.
 * Zero hardcode, consistent formatting.
 */

import type { RatingBreakdown, SafetyIncident } from '../model/types';

/**
 * Format rating cu 2 decimale (5.00 style)
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) {
    return '5.00'; // Default pentru useri noi
  }
  
  // Ensure rating is between 1.00 and 5.00
  const clampedRating = Math.max(1.0, Math.min(5.0, rating));
  return clampedRating.toFixed(2);
}

/**
 * Format rating cu stele vizuale
 */
export function formatRatingWithStars(rating: number | null | undefined): string {
  const ratingValue = formatRating(rating);
  return `⭐ ${ratingValue}`;
}

/**
 * Get rating color class bazat pe valoare
 */
export function getRatingColorToken(rating: number): string {
  if (rating >= 4.5) return 'var(--color-success-500)';
  if (rating >= 4.0) return 'var(--color-success-400)';
  if (rating >= 3.5) return 'var(--color-warning-500)';
  if (rating >= 3.0) return 'var(--color-warning-600)';
  return 'var(--color-danger-500)';
}

/**
 * Calculate rating breakdown percentages
 */
export function calculateRatingPercentages(breakdown: RatingBreakdown): {
  fiveStarsPercent: number;
  fourStarsPercent: number;
  threeStarsPercent: number;
  twoStarsPercent: number;
  oneStarPercent: number;
} {
  const { totalRatings } = breakdown;
  
  if (totalRatings === 0) {
    return {
      fiveStarsPercent: 0,
      fourStarsPercent: 0,
      threeStarsPercent: 0,
      twoStarsPercent: 0,
      oneStarPercent: 0,
    };
  }

  return {
    fiveStarsPercent: Math.round((breakdown.fiveStars / totalRatings) * 100),
    fourStarsPercent: Math.round((breakdown.fourStars / totalRatings) * 100),
    threeStarsPercent: Math.round((breakdown.threeStars / totalRatings) * 100),
    twoStarsPercent: Math.round((breakdown.twoStars / totalRatings) * 100),
    oneStarPercent: Math.round((breakdown.oneStar / totalRatings) * 100),
  };
}

/**
 * Format incident severity level
 */
export function formatIncidentSeverity(level: 1 | 2 | 3 | 4): {
  label: string;
  colorToken: string;
} {
  switch (level) {
    case 1:
      return { label: 'Minor', colorToken: 'var(--color-info-500)' };
    case 2:
      return { label: 'Moderate', colorToken: 'var(--color-warning-500)' };
    case 3:
      return { label: 'Severe', colorToken: 'var(--color-danger-500)' };
    case 4:
      return { label: 'Critical', colorToken: 'var(--color-danger-600)' };
    default:
      return { label: 'Unknown', colorToken: 'var(--color-text-tertiary)' };
  }
}

/**
 * Format investigation status
 */
export function formatInvestigationStatus(status: SafetyIncident['adminInvestigationStatus']): {
  label: string;
  colorToken: string;
} {
  switch (status) {
    case 'pending':
      return { label: 'Pending Review', colorToken: 'var(--color-warning-500)' };
    case 'investigating':
      return { label: 'Under Investigation', colorToken: 'var(--color-info-500)' };
    case 'resolved':
      return { label: 'Resolved', colorToken: 'var(--color-success-500)' };
    case 'dismissed':
      return { label: 'Dismissed', colorToken: 'var(--color-text-tertiary)' };
    default:
      return { label: 'Unknown', colorToken: 'var(--color-text-tertiary)' };
  }
}
