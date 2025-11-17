/**
 * Reviews Management Page - Orchestrator
 * 
 * Main orchestrator pentru reviews management.
 * < 200 linii conform RULES.md - single responsibility.
 */

'use client';

import React, { useState } from 'react';
import { Tabs } from '@vantage-lane/ui-core';
import { ReviewsTab } from './ReviewsTab';
import { SafetyIncidentsTab } from './SafetyIncidentsTab';
import { StatisticsTab } from './StatisticsTab';
import { ReviewDetailsModal } from './ReviewDetailsModal';
import type { DriverReview, SafetyIncident } from '@entities/review';
import styles from './ReviewsManagementPage.module.css';

export function ReviewsManagementPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'safety' | 'stats'>('reviews');

  // Review details modal state
  const [selectedReview, setSelectedReview] = useState<DriverReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const handleReviewClick = (review: DriverReview) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleIncidentClick = (incident: SafetyIncident) => {
    console.log('Incident clicked:', incident);
    // TODO: Implement safety incident modal
  };

  // Tab configuration
  const tabs = [
    {
      id: 'reviews',
      label: 'Driver Reviews',
      content: (
        <ReviewsTab onReviewClick={handleReviewClick} />
      ),
    },
    {
      id: 'safety',
      label: 'Safety Incidents',
      content: (
        <SafetyIncidentsTab onIncidentClick={handleIncidentClick} />
      ),
    },
    {
      id: 'stats',
      label: 'Statistics',
      content: (
        <StatisticsTab />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Reviews Management</h1>
          <p className={styles.subtitle}>
            Manage customer reviews and safety incidents
          </p>
        </div>
      </header>

      <div className={styles.content}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId: string) => setActiveTab(tabId as typeof activeTab)}
          variant="underline"
        />
      </div>

      {/* Review Details Modal */}
      <ReviewDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        review={selectedReview}
      />
    </div>
  );
}

ReviewsManagementPage.displayName = 'ReviewsManagementPage';
