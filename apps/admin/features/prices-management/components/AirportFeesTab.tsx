/**
 * Airport Fees Tab Component
 * 
 * Displays and allows editing of airport pickup/dropoff fees
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, AirportFee } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function AirportFeesTab({ config }: Props) {
  const { updateAirportFee, isSaving } = usePricesManagement();
  const [editingAirport, setEditingAirport] = useState<string | null>(null);
  const [editedFee, setEditedFee] = useState<Partial<AirportFee>>({});

  const airports = Object.entries(config.airport_fees);

  const handleEdit = (code: string, fee: AirportFee) => {
    setEditingAirport(code);
    setEditedFee(fee);
  };

  const handleSave = async (code: string) => {
    try {
      await updateAirportFee({
        airportCode: code,
        fee: editedFee,
      });
      setEditingAirport(null);
      setEditedFee({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingAirport(null);
    setEditedFee({});
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Airport Fees</h2>
      <p className={styles.sectionDescription}>
        Configure pickup and dropoff fees for each airport
      </p>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>Airport</th>
            <th className={styles.tableHeaderCell}>Code</th>
            <th className={styles.tableHeaderCell}>Pickup Fee</th>
            <th className={styles.tableHeaderCell}>Dropoff Fee</th>
            <th className={styles.tableHeaderCell}>Free Wait (min)</th>
            <th className={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {airports.map(([code, fee]) => {
            const isEditing = editingAirport === code;
            const displayFee = isEditing ? (editedFee as AirportFee) : fee;

            return (
              <tr key={code} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                  ✈️ {fee.name}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge} style={{
                    background: 'var(--color-primary-alpha-20)',
                    color: 'var(--color-primary)'
                  }}>
                    {code}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayFee.pickup_fee}
                      onChange={(e) =>
                        setEditedFee({ ...editedFee, pickup_fee: Number(e.target.value) })
                      }
                      min={0}
                      step={0.5}
                    />
                  ) : (
                    `£${fee.pickup_fee}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayFee.dropoff_fee}
                      onChange={(e) =>
                        setEditedFee({ ...editedFee, dropoff_fee: Number(e.target.value) })
                      }
                      min={0}
                      step={0.5}
                    />
                  ) : (
                    `£${fee.dropoff_fee}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayFee.free_wait_minutes}
                      onChange={(e) =>
                        setEditedFee({ ...editedFee, free_wait_minutes: Number(e.target.value) })
                      }
                      min={0}
                      step={5}
                    />
                  ) : (
                    `${fee.free_wait_minutes} min`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSave(code)}
                        disabled={isSaving}
                      >
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(code, fee)}>
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Central London → Heathrow</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£127.50</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Heathrow Dropoff Fee:</span>
          <span className={styles.exampleValue}>
            £{config.airport_fees.LHR?.dropoff_fee.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(127.5 + (config.airport_fees.LHR?.dropoff_fee || 0)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
