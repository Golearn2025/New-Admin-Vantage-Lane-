/**
 * Return Settings Tab Component
 * 
 * Configure return trip discount and policies
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

interface ReturnSettings {
  discount_rate: number;
  minimum_hours_between: number;
}

export function ReturnSettingsTab({ config }: Props) {
  const { updateReturnSettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<ReturnSettings>(
    (config as any).return_settings || { discount_rate: 0.10, minimum_hours_between: 2 }
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
    setEditedSettings((config as any).return_settings || { discount_rate: 0.10, minimum_hours_between: 2 });
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : ((config as any).return_settings || editedSettings);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Return Trip Settings</h2>
      <p className={styles.sectionDescription}>
        Configure return trip discount and minimum time between trips
      </p>

      {/* Return Discount */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🔄 Return Trip Discount</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Setting</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Discount Rate
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={settings.discount_rate * 100}
                      onChange={(e) =>
                        setEditedSettings({
                          ...editedSettings,
                          discount_rate: Number(e.target.value) / 100,
                        })
                      }
                      min={0}
                      max={50}
                      step={1}
                      style={{ width: '100px' }}
                    />
                    <span>%</span>
                  </div>
                ) : (
                  <span className={styles.statusBadge} style={{
                    background: 'var(--color-success-alpha-20)',
                    color: 'var(--color-success)'
                  }}>
                    {(settings.discount_rate * 100).toFixed(0)}%
                  </span>
                )}
              </td>
              <td className={styles.tableCell}>
                Discount applied to return trips (outbound + return) × (1 - discount)
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Minimum Hours Between
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={settings.minimum_hours_between}
                      onChange={(e) =>
                        setEditedSettings({
                          ...editedSettings,
                          minimum_hours_between: Number(e.target.value),
                        })
                      }
                      min={0}
                      max={48}
                      step={1}
                      style={{ width: '100px' }}
                    />
                    <span>hours</span>
                  </div>
                ) : (
                  `${settings.minimum_hours_between} hours`
                )}
              </td>
              <td className={styles.tableCell}>
                Minimum time required between outbound and return trips
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-6)' }}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              💾 Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            ✏️ Edit Settings
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
