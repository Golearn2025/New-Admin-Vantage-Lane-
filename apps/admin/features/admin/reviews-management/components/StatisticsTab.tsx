/**
 * Statistics Tab Component
 * 
 * Dedicated tab pentru platform statistics cu live data calculation.
 * Single responsibility - < 200 linii conform RULES.md
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card,
  RatingDisplay,
  RatingBreakdown,
  Badge
} from '@vantage-lane/ui-core';
import { getPlatformStatistics } from '@entities/review/api/reviewApi';
import styles from './StatisticsTab.module.css';

interface RatingBreakdownData {
  averageRating: number;
  totalRatings: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

interface SafetyStats {
  pending: number;
  investigating: number;
  resolved: number;
  dismissed: number;
  total: number;
}

interface StatisticsState {
  ratingBreakdown: RatingBreakdownData | null;
  safetyStats: SafetyStats | null;
  loading: boolean;
  error: string | null;
}

export function StatisticsTab() {
  // Platform statistics state
  const [statistics, setStatistics] = useState<StatisticsState>({
    ratingBreakdown: null,
    safetyStats: null,
    loading: true,
    error: null
  });

  // Load platform statistics when tab becomes active
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setStatistics(prev => ({ ...prev, loading: true, error: null }));
        const stats = await getPlatformStatistics();
        setStatistics(prev => ({ 
          ...prev, 
          ratingBreakdown: stats.ratingBreakdown,
          safetyStats: stats.safetyStats,
          loading: false 
        }));
      } catch (error) {
        setStatistics(prev => ({ 
          ...prev, 
          loading: false, 
          error: (error as Error).message || 'Failed to load statistics' 
        }));
      }
    };

    loadStatistics();
  }, []);

  if (statistics.loading) {
    return (
      <div className={styles.loading}>
        Loading statistics...
      </div>
    );
  }

  if (statistics.error) {
    return (
      <div className={styles.error}>
        Error: {statistics.error}
      </div>
    );
  }

  return (
    <div className={styles.statisticsTab}>
      <div className={styles.statsGrid}>
        {/* Platform Average Rating Card */}
        <Card>
          <h3>Platform Average Rating</h3>
          {statistics.ratingBreakdown ? (
            <RatingDisplay
              rating={statistics.ratingBreakdown.averageRating}
              totalRatings={statistics.ratingBreakdown.totalRatings}
              size="lg"
              showCount={true}
            />
          ) : (
            <div>No rating data available</div>
          )}
        </Card>
        
        {/* Rating Distribution Card */}
        <Card>
          <h3>Rating Distribution</h3>
          {statistics.ratingBreakdown ? (
            <RatingBreakdown
              data={{
                fiveStars: statistics.ratingBreakdown.fiveStars,
                fourStars: statistics.ratingBreakdown.fourStars,
                threeStars: statistics.ratingBreakdown.threeStars,
                twoStars: statistics.ratingBreakdown.twoStars,
                oneStar: statistics.ratingBreakdown.oneStar,
                totalRatings: statistics.ratingBreakdown.totalRatings,
                averageRating: statistics.ratingBreakdown.averageRating
              }}
              size="md"
            />
          ) : (
            <div>No rating breakdown available</div>
          )}
        </Card>
        
        {/* Safety Overview Card */}
        <Card>
          <h3>Safety Overview</h3>
          {statistics.safetyStats ? (
            <div className={styles.safetyStats}>
              <div className={styles.statRow}>
                <span>Total Reports</span>
                <Badge color="info" variant="soft">
                  {statistics.safetyStats.total}
                </Badge>
              </div>
              
              <div className={styles.statRow}>
                <span>Pending Investigation</span>
                <Badge color="warning" variant="soft">
                  {statistics.safetyStats.pending}
                </Badge>
              </div>
              
              <div className={styles.statRow}>
                <span>Investigating</span>
                <Badge color="info" variant="soft">
                  {statistics.safetyStats.investigating}
                </Badge>
              </div>
              
              <div className={styles.statRow}>
                <span>Resolved</span>
                <Badge color="success" variant="soft">
                  {statistics.safetyStats.resolved}
                </Badge>
              </div>
              
              <div className={styles.statRow}>
                <span>Dismissed</span>
                <Badge color="neutral" variant="soft">
                  {statistics.safetyStats.dismissed}
                </Badge>
              </div>
            </div>
          ) : (
            <div>No safety data available</div>
          )}
        </Card>
      </div>
    </div>
  );
}

StatisticsTab.displayName = 'StatisticsTab';
