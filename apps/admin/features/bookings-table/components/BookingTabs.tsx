/**
 * BookingTabs Component
 * 
 * Tab navigation for filtering bookings by type
 * 
 * Compliant:
 * - <200 lines
 * - Design tokens 100%
 * - TypeScript strict
 * - Reusable component
 */

'use client';

import React from 'react';
import type { BookingTabsProps, BookingTab } from '../types/tabs';
import styles from './BookingTabs.module.css';

export function BookingTabs({ activeTab, onTabChange, tabs, isLoading }: BookingTabsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.value)}
            disabled={isLoading}
            aria-selected={activeTab === tab.value}
            role="tab"
          >
            <span className={styles.tabLabel}>
              {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
              {tab.label}
            </span>
            <span className={styles.tabCount}>
              {isLoading ? (
                <span className={styles.skeleton} />
              ) : (
                tab.count.toLocaleString()
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Tab Definition Helper
 * Creates tab configuration with default icons
 */
export function createBookingTabs(counts: { [key: string]: number }): BookingTab[] {
  return [
    {
      value: 'all',
      label: 'All Bookings',
      icon: '📋',
      count: counts.all || 0,
    },
    {
      value: 'oneway',
      label: 'One Way',
      icon: '→',
      count: counts.oneway || 0,
    },
    {
      value: 'return',
      label: 'Return',
      icon: '⟲',
      count: counts.return || 0,
    },
    {
      value: 'hourly',
      label: 'Hourly',
      icon: '⏱',
      count: counts.hourly || 0,
    },
    {
      value: 'fleet',
      label: 'Fleet',
      icon: '🚗',
      count: counts.fleet || 0,
    },
    {
      value: 'by_request',
      label: 'By Request',
      icon: '📞',
      count: counts.by_request || 0,
    },
    {
      value: 'events',
      label: 'Events',
      icon: '🎉',
      count: counts.events || 0,
    },
    {
      value: 'corporate',
      label: 'Corporate',
      icon: '🏢',
      count: counts.corporate || 0,
    },
  ];
}
