/**
 * PeakHoursTab Component
 *
 * Hourly booking analysis with charts and insights.
 * File: < 200 lines (RULES.md compliant)
 */

import React, { useMemo } from 'react';
import { Card, Badge, Icon } from '@vantage-lane/ui-core';
import { formatHour, formatNumber } from '@entities/business-intelligence';
import { EmptyStateCard } from './EmptyStateCard';
import type { BusinessIntelligenceData } from '@entities/business-intelligence';
import styles from './PeakHoursTab.module.css';

interface PeakHoursTabProps {
  data: BusinessIntelligenceData | null;
  hasData: boolean;
}

export function PeakHoursTab({ data, hasData }: PeakHoursTabProps) {
  if (!hasData || !data?.peakHours.length) {
    return (
      <EmptyStateCard 
        type="peakHours" 
        icon="clock" 
        title="Peak Hours Analysis"
      />
    );
  }

  const { peakHours } = data;
  
  // Memoize calculations to prevent re-computation on every render
  const sortedHours = useMemo(() => 
    [...peakHours].sort((a, b) => a.hourOfDay - b.hourOfDay), 
    [peakHours]
  );
  
  const peakHour = useMemo(() => 
    peakHours.reduce((max, hour) => 
      hour.bookingsCount > max.bookingsCount ? hour : max
    ), 
    [peakHours]
  );

  const chartData = useMemo(() => 
    sortedHours.map(hour => ({
      name: formatHour(hour.hourOfDay),
      value: hour.bookingsCount,
      hour: hour.hourOfDay,
    })), 
    [sortedHours]
  );

  // Memoize chart bars for performance
  const chartBars = useMemo(() => 
    sortedHours.slice(0, 12).map(hour => (
      <div key={hour.hourOfDay} className={styles.chartBar}>
        <div 
          className={styles.chartBarFill}
          style={{
            height: `${(hour.bookingsCount / peakHour.bookingsCount) * 100}%`
          }}
        />
        <span className={styles.chartBarLabel}>
          {hour.hourOfDay}h
        </span>
      </div>
    )), 
    [sortedHours, peakHour.bookingsCount]
  );

  // Memoize hours list for breakdown table
  const hoursList = useMemo(() => 
    sortedHours.map((hour) => (
      <div key={hour.hourOfDay} className={styles.hourRow}>
        <div className={styles.hourTime}>
          <Icon name="clock" size="sm" />
          <span>{formatHour(hour.hourOfDay)}</span>
        </div>
        <div className={styles.hourStats}>
          <Badge 
            color={hour.bookingsCount === peakHour.bookingsCount ? 'success' : 'info'}
            variant="outline"
            size="sm"
          >
            {formatNumber(hour.bookingsCount)} bookings
          </Badge>
        </div>
      </div>
    )), 
    [sortedHours, peakHour.bookingsCount]
  );

  return (
    <div className={styles.peakHoursContainer}>
      {/* Peak Hour Highlight */}
      <Card className={styles.peakHourCard || ''}>
        <div className={styles.peakHourHeader}>
          <Icon name="clock" size="lg" />
          <div className={styles.peakHourInfo}>
            <h3 className={styles.peakHourTitle}>Peak Hour</h3>
            <div className={styles.peakHourTime}>
              {formatHour(peakHour.hourOfDay)}
            </div>
          </div>
          <Badge color="warning" variant="solid" size="lg">
            {formatNumber(peakHour.bookingsCount)} bookings
          </Badge>
        </div>
        
        <p className={styles.peakHourDescription}>
          📈 Maximum booking activity during this hour
        </p>
      </Card>

      {/* Hourly Distribution Chart */}
      <Card className={styles.chartCard || ''}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Hourly Distribution</h3>
          <Badge color="info" variant="outline" size="sm">
            Live Data
          </Badge>
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.chartPlaceholder}>
            <Icon name="clock" size="lg" />
            <div className={styles.chartBars}>
              {chartBars}
            </div>
          </div>
        </div>
      </Card>

      {/* Hourly Breakdown Table */}
      <Card className={styles.breakdownCard || ''}>
        <h3 className={styles.breakdownTitle}>Hourly Breakdown</h3>
        
        <div className={styles.hoursList}>
          {hoursList}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className={styles.recommendationsCard || ''}>
        <div className={styles.recommendationsHeader}>
          <Icon name="star" size="sm" />
          <h3 className={styles.recommendationsTitle}>Smart Recommendations</h3>
        </div>

        <div className={styles.recommendationsList}>
          <div className={styles.recommendationItem}>
            <Icon name="star" size="sm" />
            <div>
              <strong>Surge Pricing:</strong> Consider +40% pricing during {formatHour(peakHour.hourOfDay)} peak hour
            </div>
          </div>
          
          <div className={styles.recommendationItem}>
            <Icon name="users" size="sm" />
            <div>
              <strong>Driver Availability:</strong> Ensure 2-3 extra drivers during peak times
            </div>
          </div>
          
          <div className={styles.recommendationItem}>
            <Icon name="clock" size="sm" />
            <div>
              <strong>Planning:</strong> Schedule maintenance outside {formatHour(peakHour.hourOfDay)} to maximize revenue
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
