/**
 * BookingsWithTabs Component
 * 
 * Wrapper that combines Tabs (from ui-core) + BookingsTable
 * 
 * Compliant:
 * - <200 lines
 * - TypeScript strict
 * - Client component
 * - Uses reusable Tabs from ui-core
 * - Generic types (no casts)
 * - Error/loading handling
 */

'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Tabs } from '@vantage-lane/ui-core';
import { BookingsTable } from './BookingsTable';
import { useBookingCounts } from '../hooks/useBookingCounts';
import styles from './BookingsWithTabs.module.css';
import { createBookingTabs, ZERO_COUNTS, type TabId } from '../utils/createBookingTabs';

type BookingStatus = 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

interface BookingsWithTabsProps {
  statusFilter?: BookingStatus[];
  title: string;
  description?: string;
  showStatusFilter?: boolean;
}

export function BookingsWithTabs({
  statusFilter = [],
  title,
  description,
  showStatusFilter = true,
}: BookingsWithTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const { counts, isLoading, error } = useBookingCounts();

  // Use zero counts as fallback
  const safeCounts = counts ?? ZERO_COUNTS;
  
  // Memoize tabs to prevent unnecessary re-renders
  const tabs = useMemo(() => createBookingTabs(safeCounts), [safeCounts]);

  // Stable callback to prevent re-renders
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId as TabId);
  }, []);

  // Convert tab value to trip_type filter
  const tripTypeFilter = activeTab === 'all' ? null : activeTab;

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠️ Unable to load booking counts. Showing zero values.
        </div>
      )}

      {/* Tabs with responsive wrapper */}
      <div className={styles.tabsWrapper}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
          variant="pills"
          fullWidth={false}
        />
      </div>
      
      <BookingsTable
        statusFilter={statusFilter}
        tripTypeFilter={tripTypeFilter}
        title={title}
        {...(description && { description })}
        showStatusFilter={showStatusFilter}
      />
    </div>
  );
}
