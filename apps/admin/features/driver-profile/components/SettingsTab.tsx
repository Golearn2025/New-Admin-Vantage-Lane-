/**
 * SettingsTab Component
 * Admin configures which job types driver can accept
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ ui-core components (Card, Checkbox, Button)
 * ✅ lucide-react icons only
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Button, ErrorBanner } from '@vantage-lane/ui-core';
import { Save, Briefcase } from 'lucide-react';
import { listJobCategories, getDriverJobTypes, updateDriverJobTypes } from '@entities/vehicle';
import type { JobCategory } from '@entities/vehicle';
import styles from './SettingsTab.module.css';

interface SettingsTabProps {
  driverId: string;
  adminId: string;
}

export function SettingsTab({ driverId, adminId }: SettingsTabProps) {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all categories
        const allCategories = await listJobCategories();
        setCategories(allCategories);

        // Fetch driver's current job types
        const driverJobTypes = await getDriverJobTypes(driverId);
        
        // Set initially selected categories
        const selected = new Set(
          driverJobTypes
            .filter(djt => djt.isAllowed)
            .map(djt => djt.jobCategoryId)
        );
        setSelectedCategories(selected);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [driverId]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      await updateDriverJobTypes(driverId, adminId, Array.from(selectedCategories));
      
      setSuccessMessage('Job types configuration saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save settings'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className={styles.loading}>Loading settings...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorBanner 
        message={error.message} 
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Briefcase size={24} className={styles.headerIcon} />
            <div>
              <h3 className={styles.title}>Job Types Configuration</h3>
              <p className={styles.description}>
                Select which job types this driver can accept. This determines which bookings
                will be visible to the driver in their app.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map(category => (
            <div key={category.id} className={styles.categoryCard}>
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.has(category.id)}
                onChange={() => handleToggleCategory(category.id)}
                label={category.name}
              />
              {category.description && (
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {successMessage && (
          <div className={styles.successBanner}>
            {successMessage}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            leftIcon={<Save size={16} />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>

      <Card>
        <h4 className={styles.infoTitle}>How it works</h4>
        <ul className={styles.infoList}>
          <li>Selected job types will be visible to the driver in their app</li>
          <li>Driver can only accept bookings from selected categories</li>
          <li>Changes take effect immediately after saving</li>
          <li>You can modify settings at any time</li>
        </ul>
      </Card>
    </div>
  );
}
