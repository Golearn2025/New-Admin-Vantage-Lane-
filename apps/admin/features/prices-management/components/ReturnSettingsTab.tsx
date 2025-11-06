/**
 * Return Settings Tab Component
 * 
 * Configure return trip discount and policies
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Save, Edit } from 'lucide-react';
import { ReturnSettingsTable } from './return-settings/ReturnSettingsTable';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, ReturnSettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function ReturnSettingsTab({ config }: Props) {
  const { updateReturnSettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaultSettings: ReturnSettings = { discount_rate: 0.10, minimum_hours_between: 2 };

  const [editedSettings, setEditedSettings] = useState<ReturnSettings>(
    config.return_settings || defaultSettings
  );

  const handleSave = async () => {
    try {
      await updateReturnSettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedSettings(config.return_settings || defaultSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : (config.return_settings || editedSettings);

  // Table extracted into dedicated component

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Return Trip Settings</h2>
      <p className={styles.sectionDescription}>
        Configure return trip discount and minimum time between trips
      </p>

      {/* Return Discount */}
      <ReturnSettingsTable
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
              <Save className="h-4 w-4" /> Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Return Trip Mayfair ↔ Heathrow</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Outbound (Mayfair → LHR):</span>
          <span className={styles.exampleValue}>£130.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Return (LHR → Mayfair):</span>
          <span className={styles.exampleValue}>£130.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Subtotal:</span>
          <span className={styles.exampleValue}>£260.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Return Discount ({(settings.discount_rate * 100).toFixed(0)}%):</span>
          <span className={styles.exampleValue}>
            -£{(260 * settings.discount_rate).toFixed(2)}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Final Price:</span>
          <span className={styles.exampleValue}>
            £{(260 * (1 - settings.discount_rate)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
