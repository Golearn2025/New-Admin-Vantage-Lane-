/**
 * Vehicle Types Tab Component
 * 
 * Displays and allows editing of vehicle type rates
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, VehicleTypeRates } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function VehicleTypesTab({ config }: Props) {
  const { updateVehicleType, isSaving } = usePricesManagement();
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editedRates, setEditedRates] = useState<Partial<VehicleTypeRates>>({});

  const vehicleTypes = Object.entries(config.vehicle_types);

  const handleEdit = (type: string, rates: VehicleTypeRates) => {
    setEditingType(type);
    setEditedRates(rates);
  };

  const handleSave = async (type: string) => {
    try {
      await updateVehicleType({
        vehicleType: type,
        rates: editedRates,
      });
      setEditingType(null);
      setEditedRates({});
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditedRates({});
  };

  const calculateExample = (rates: VehicleTypeRates) => {
    const distance = 15.5; // miles
    const duration = 45; // minutes
    const first6 = Math.min(distance, 6) * rates.per_mile_first_6;
    const remaining = Math.max(distance - 6, 0) * rates.per_mile_after_6;
    const distanceFee = first6 + remaining;
    const timeFee = duration * rates.per_minute;
    const total = rates.base_fare + distanceFee + timeFee;

    return {
      baseFare: rates.base_fare,
      distanceFee,
      timeFee,
      total: Math.max(total, rates.minimum_fare),
    };
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Vehicle Type Rates</h2>
      <p className={styles.sectionDescription}>
        Configure base fares, per-mile rates, and hourly rates for each vehicle type
      </p>

      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>Vehicle Type</th>
            <th className={styles.tableHeaderCell}>Base Fare</th>
            <th className={styles.tableHeaderCell}>Per Mile (1-6)</th>
            <th className={styles.tableHeaderCell}>Per Mile (6+)</th>
            <th className={styles.tableHeaderCell}>Per Minute</th>
            <th className={styles.tableHeaderCell}>Minimum</th>
            <th className={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicleTypes.map(([type, rates]) => {
            const isEditing = editingType === type;
            const displayRates = isEditing ? (editedRates as VehicleTypeRates) : rates;

            return (
              <tr key={type} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                  🚗 {rates.name}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayRates.base_fare}
                      onChange={(e) =>
                        setEditedRates({ ...editedRates, base_fare: Number(e.target.value) })
                      }
                      min={0}
                      step={1}
                    />
                  ) : (
                    `£${rates.base_fare}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayRates.per_mile_first_6}
                      onChange={(e) =>
                        setEditedRates({
                          ...editedRates,
                          per_mile_first_6: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={0.1}
                    />
                  ) : (
                    `£${rates.per_mile_first_6}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayRates.per_mile_after_6}
                      onChange={(e) =>
                        setEditedRates({
                          ...editedRates,
                          per_mile_after_6: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={0.1}
                    />
                  ) : (
                    `£${rates.per_mile_after_6}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayRates.per_minute}
                      onChange={(e) =>
                        setEditedRates({ ...editedRates, per_minute: Number(e.target.value) })
                      }
                      min={0}
                      step={0.01}
                    />
                  ) : (
                    `£${rates.per_minute}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={displayRates.minimum_fare}
                      onChange={(e) =>
                        setEditedRates({ ...editedRates, minimum_fare: Number(e.target.value) })
                      }
                      min={0}
                      step={1}
                    />
                  ) : (
                    `£${rates.minimum_fare}`
                  )}
                </td>
                <td className={styles.tableCell}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSave(type)}
                        disabled={isSaving}
                      >
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(type, rates)}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Example Calculation */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example Calculation (Executive)</h3>
        {config.vehicle_types.executive && (() => {
          const example = calculateExample(config.vehicle_types.executive!);
          return (
            <>
              <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Base Fare:</span>
                <span className={styles.exampleValue}>£{example.baseFare.toFixed(2)}</span>
              </div>
              <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Distance Fee (15.5 miles):</span>
                <span className={styles.exampleValue}>£{example.distanceFee.toFixed(2)}</span>
              </div>
              <div className={styles.exampleRow}>
                <span className={styles.exampleLabel}>Time Fee (45 min):</span>
                <span className={styles.exampleValue}>£{example.timeFee.toFixed(2)}</span>
              </div>
              <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
                <span className={styles.exampleLabel}>Total:</span>
                <span className={styles.exampleValue}>£{example.total.toFixed(2)}</span>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
