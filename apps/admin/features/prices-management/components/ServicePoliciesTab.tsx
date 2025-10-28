/**
 * Service Policies Tab Component
 * 
 * Displays and allows editing of service policies (waiting, multi-stop, minimums)
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, ServicePolicies } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function ServicePoliciesTab({ config }: Props) {
  const { updateServicePolicies, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicies, setEditedPolicies] = useState<ServicePolicies>(config.service_policies);

  const handleSave = async () => {
    try {
      await updateServicePolicies(editedPolicies);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedPolicies(config.service_policies);
    setIsEditing(false);
  };

  const policies = isEditing ? editedPolicies : config.service_policies;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Service Policies</h2>
      <p className={styles.sectionDescription}>
        Configure waiting times, multi-stop fees, and minimum requirements
      </p>

      {/* Waiting Time Policies */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⏱️ Waiting Time</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Policy</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Free Waiting (Normal)
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.free_waiting_normal_minutes}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          free_waiting_normal_minutes: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={5}
                      style={{ width: '100px' }}
                    />
                    <span>minutes</span>
                  </div>
                ) : (
                  `${policies.free_waiting_normal_minutes} minutes`
                )}
              </td>
              <td className={styles.tableCell}>
                Free waiting time for regular pickups
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Free Waiting (Airport)
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.free_waiting_airport_minutes}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          free_waiting_airport_minutes: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={5}
                      style={{ width: '100px' }}
                    />
                    <span>minutes</span>
                  </div>
                ) : (
                  `${policies.free_waiting_airport_minutes} minutes`
                )}
              </td>
              <td className={styles.tableCell}>
                Free waiting time for airport pickups
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Waiting Rate
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span>£</span>
                    <Input
                      type="number"
                      value={policies.waiting_rate_per_hour}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          waiting_rate_per_hour: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={0.5}
                      style={{ width: '100px' }}
                    />
                    <span>per hour</span>
                  </div>
                ) : (
                  `£${policies.waiting_rate_per_hour.toFixed(2)} per hour`
                )}
              </td>
              <td className={styles.tableCell}>
                Charge per hour after free waiting time
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional Services */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>➕ Additional Services</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Service</th>
              <th className={styles.tableHeaderCell}>Fee</th>
              <th className={styles.tableHeaderCell}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Multi-Stop Fee
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span>£</span>
                    <Input
                      type="number"
                      value={policies.multi_stop_fee}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          multi_stop_fee: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={1}
                      style={{ width: '100px' }}
                    />
                  </div>
                ) : (
                  `£${policies.multi_stop_fee.toFixed(2)}`
                )}
              </td>
              <td className={styles.tableCell}>
                Fee per additional stop
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Minimum Requirements */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📏 Minimum Requirements</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Requirement</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Minimum Distance
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.minimum_distance_miles}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          minimum_distance_miles: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={0.5}
                      style={{ width: '100px' }}
                    />
                    <span>miles</span>
                  </div>
                ) : (
                  `${policies.minimum_distance_miles} miles`
                )}
              </td>
              <td className={styles.tableCell}>
                Minimum billable distance for pricing
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Minimum Time
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.minimum_time_minutes}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          minimum_time_minutes: Number(e.target.value),
                        })
                      }
                      min={0}
                      step={5}
                      style={{ width: '100px' }}
                    />
                    <span>minutes</span>
                  </div>
                ) : (
                  `${policies.minimum_time_minutes} minutes`
                )}
              </td>
              <td className={styles.tableCell}>
                Minimum billable time for pricing
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
              💾 Save All Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            ✏️ Edit Policies
          </Button>
        )}
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Airport Pickup with 60 min Wait</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£130.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Free Waiting (Airport):</span>
          <span className={styles.exampleValue}>
            {policies.free_waiting_airport_minutes} min (FREE)
          </span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Billable Waiting:</span>
          <span className={styles.exampleValue}>
            {60 - policies.free_waiting_airport_minutes} min × £
            {(policies.waiting_rate_per_hour / 60).toFixed(2)}/min = £
            {((60 - policies.free_waiting_airport_minutes) * (policies.waiting_rate_per_hour / 60)).toFixed(2)}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(130 + ((60 - policies.free_waiting_airport_minutes) * (policies.waiting_rate_per_hour / 60))).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
