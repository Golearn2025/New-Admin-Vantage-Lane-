/**
 * BookingsWithTabs Component
 * 
 * Wrapper that combines BookingTabs + BookingsTable
 * 
 * Compliant:
 * - <200 lines
 * - TypeScript strict
 * - Client component
 */

'use client';

import React, { useState } from 'react';
import { BookingTabs, createBookingTabs } from './BookingTabs';
import { BookingsTable } from './BookingsTable';
import { useBookingCounts } from '../hooks/useBookingCounts';
import type { BookingTabValue } from '../types/tabs';

interface BookingsWithTabsProps {
  statusFilter?: string[];
  title: string;
  description?: string;
  showStatusFilter?: boolean;
}

export function BookingsWithTabs({
  statusFilter = [],
  title,
  description,
  showStatusFilter,
}: BookingsWithTabsProps) {
  const [activeTab, setActiveTab] = useState<BookingTabValue>('all');
  const { counts, isLoading: countsLoading, error } = useBookingCounts();

  // Always show tabs, even if counts is null (with 0s as fallback)
  const defaultCounts = {
    all: 0,
    oneway: 0,
    return: 0,
    hourly: 0,
    fleet: 0,
    by_request: 0,
    events: 0,
    corporate: 0,
  };

  const tabs = createBookingTabs((counts || defaultCounts) as unknown as { [key: string]: number });

  // Convert tab value to trip_type filter
  const tripTypeFilter = activeTab === 'all' ? null : activeTab;

  return (
    <div>
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        isLoading={countsLoading}
      />
      <BookingsTable
        statusFilter={statusFilter}
        tripTypeFilter={tripTypeFilter}
        title={title}
        {...(description && { description })}
        {...(showStatusFilter !== undefined && { showStatusFilter })}
      />
    </div>
  );
}
