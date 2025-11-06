/**
 * Hourly Hire Tab Component
 * 
 * Configure hourly hire rates and restrictions
 * Architecture: Feature component (UI only, no business logic)
 * MAX 200 lines per RULES.md
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Save, Edit } from 'lucide-react';
import { HourlyRatesSection } from './hourly-hire/HourlyRatesSection';
import { RestrictionsSection } from './hourly-hire/RestrictionsSection';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, HourlySettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

type HourlyRates = HourlySettings['rates'];

export function HourlyHireTab({ config }: Props) {
  const { updateHourlySettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaultSettings: HourlySettings = {
    rates: { executive: 80, luxury: 90, van: 90, suv: 110 },
    minimum_hours: 3,
    maximum_hours: 12,
    distance_limit_per_hour: 15,
    area_restriction: 'm25'
  };

  const [editedSettings, setEditedSettings] = useState<HourlySettings>(
    config.hourly_settings || defaultSettings
  );

  const handleSave = async () => {
    try {
      await updateHourlySettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedSettings(config.hourly_settings || editedSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : (config.hourly_settings || editedSettings);

  // Tables extracted into dedicated sections

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Hourly Hire Settings</h2>

      {/* Rates */}
      <HourlyRatesSection
        settings={settings}
        editedSettings={editedSettings}
        setEditedSettings={setEditedSettings}
        isEditing={isEditing}
      />

      {/* Restrictions */}
      <RestrictionsSection
        settings={settings}
        editedSettings={editedSettings}
        setEditedSettings={setEditedSettings}
        isEditing={isEditing}
      />

      {/* Actions */}
      <div className={styles.actionsContainer}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>
    </div>
  );
}
