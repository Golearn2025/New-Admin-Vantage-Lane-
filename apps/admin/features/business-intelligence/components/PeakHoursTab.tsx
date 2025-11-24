/**
 * PeakHoursTab Component
 *
 * Hourly booking analysis with charts and insights.
 * File: < 200 lines (RULES.md compliant)
 */

import React from 'react';
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
  
  // Sort by hour for display
  const sortedHours = [...peakHours].sort((a, b) => a.hourOfDay - b.hourOfDay);
  
  // Find peak hour
  const peakHour = peakHours.reduce((max, hour) => 
    hour.bookingsCount > max.bookingsCount ? hour : max
  );

  // Prepare chart data
  const chartData = sortedHours.map(hour => ({
    name: formatHour(hour.hourOfDay),
    value: hour.bookingsCount,
    hour: hour.hourOfDay,
  }));

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
              {sortedHours.slice(0, 12).map(hour => (
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
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Hourly Breakdown Table */}
      <Card className={styles.breakdownCard || ''}>
        <h3 className={styles.breakdownTitle}>Hourly Breakdown</h3>
        
        <div className={styles.hoursList}>
          {sortedHours.map((hour) => (
            <div key={hour.hourOfDay} className={styles.hourRow}>
              <div className={styles.hourTime}>
                <Icon name="clock" size="sm" />
                <span>{formatHour(hour.hourOfDay)}</span>
              </div>
              
              <div className={styles.hourStats}>
                <Badge color="neutral" variant="outline" size="sm">
                  {formatNumber(hour.bookingsCount)} bookings
                </Badge>
                
                <div className={styles.hourStats}>
                  <Icon name="trending-up" size="sm" />
                  <span>{hour.averageDistance > 0 ? `${hour.averageDistance}mi` : 'Variat'}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className={styles.hourProgress}>
                <div 
                  className={styles.hourProgressBar}
                  style={{
                    width: `${(hour.bookingsCount / peakHour.bookingsCount) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
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
