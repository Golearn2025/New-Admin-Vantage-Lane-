/**
 * ACTIVITY CARD - PREMIUM
 * 
 * Timeline-style card for showing recent activities/events
 * Perfect for activity feeds, notifications, or history
 * 
 * Features:
 * - Timeline design with icons
 * - Theme-colored indicators
 * - Timestamps
 * - Interactive items
 */

'use client';

import React from 'react';
import { Card } from '../Card';
import { Icon, type IconName } from '../Icon';
import styles from './ActivityCard.module.css';

export interface ActivityItem {
  title: string;
  description?: string;
  time: string;
  icon?: IconName;
  iconColor?: 'theme' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
}

export interface ActivityCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Array of activities */
  activities: ActivityItem[];
  /** Show "View all" link */
  showViewAll?: boolean;
  /** View all click handler */
  onViewAllClick?: () => void;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function ActivityCard({
  title,
  subtitle,
  activities,
  showViewAll = false,
  onViewAllClick,
  variant = 'elevated',
  className = '',
}: ActivityCardProps) {
  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;
          
          return (
            <div
              key={index}
              className={`${styles.activityItem} ${
                activity.onClick ? styles.activityItemClickable : ''
              }`}
              onClick={activity.onClick}
            >
              {/* Icon/Indicator */}
              <div className={styles.iconContainer}>
                <div
                  className={`${styles.iconWrapper} ${
                    styles[`icon-${activity.iconColor || 'theme'}`]
                  }`}
                >
                  {activity.icon ? (
                    <Icon
                      name={activity.icon}
                      size="sm"
                      color={activity.iconColor || 'theme'}
                    />
                  ) : (
                    <div className={styles.dot} />
                  )}
                </div>
                {!isLast && <div className={styles.connector} />}
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.activityTitle}>{activity.title}</div>
                {activity.description && (
                  <div className={styles.activityDescription}>
                    {activity.description}
                  </div>
                )}
                <div className={styles.activityTime}>{activity.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {showViewAll && (
        <div className={styles.footer}>
          <button
            className={styles.viewAllButton}
            onClick={onViewAllClick}
            type="button"
          >
            View all activities
            <Icon name="arrow-right" size="sm" color="theme" />
          </button>
        </div>
      )}
    </Card>
  );
}
