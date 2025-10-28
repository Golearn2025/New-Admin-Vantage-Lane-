/**
 * General Policies Tab Component
 * 
 * Displays and allows editing of general policies (rounding, cancellation, corporate discounts)
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, GeneralPolicies } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function GeneralPoliciesTab({ config }: Props) {
  const { updateGeneralPolicies, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicies, setEditedPolicies] = useState<GeneralPolicies>(config.general_policies);

  const handleSave = async () => {
    try {
      await updateGeneralPolicies(editedPolicies);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedPolicies(config.general_policies);
    setIsEditing(false);
  };

  const policies = isEditing ? editedPolicies : config.general_policies;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>General Policies</h2>
      <p className={styles.sectionDescription}>
        Configure rounding rules, cancellation policies, and corporate discounts
      </p>

      {/* Rounding Policy */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🔢 Price Rounding</h3>
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
                Round To
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span>£</span>
                    <Input
                      type="number"
                      value={policies.rounding.to}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          rounding: {
                            ...editedPolicies.rounding,
                            to: Number(e.target.value),
                          },
                        })
                      }
                      min={1}
                      step={1}
                      style={{ width: '100px' }}
                    />
                  </div>
                ) : (
                  `£${policies.rounding.to}`
                )}
              </td>
              <td className={styles.tableCell}>
                Round final price to nearest multiple
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Direction
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <select
                    value={policies.rounding.direction}
                    onChange={(e) =>
                      setEditedPolicies({
                        ...editedPolicies,
                        rounding: {
                          ...editedPolicies.rounding,
                          direction: e.target.value as 'up' | 'down' | 'nearest',
                        },
                      })
                    }
                    style={{
                      padding: 'var(--spacing-2)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <option value="up">Round Up</option>
                    <option value="down">Round Down</option>
                    <option value="nearest">Round to Nearest</option>
                  </select>
                ) : (
                  <span className={styles.statusBadge} style={{
                    background: 'var(--color-primary-alpha-20)',
                    color: 'var(--color-primary)'
                  }}>
                    {policies.rounding.direction === 'up' && '⬆️ Round Up'}
                    {policies.rounding.direction === 'down' && '⬇️ Round Down'}
                    {policies.rounding.direction === 'nearest' && '↕️ Round to Nearest'}
                  </span>
                )}
              </td>
              <td className={styles.tableCell}>
                Rounding direction for final price
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cancellation Policy */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>❌ Cancellation Policy</h3>
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
                Free Cancellation
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.cancellation.free_hours}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          cancellation: {
                            ...editedPolicies.cancellation,
                            free_hours: Number(e.target.value),
                          },
                        })
                      }
                      min={0}
                      step={1}
                      style={{ width: '100px' }}
                    />
                    <span>hours before</span>
                  </div>
                ) : (
                  `${policies.cancellation.free_hours} hours before`
                )}
              </td>
              <td className={styles.tableCell}>
                Free cancellation window before trip
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                Cancellation Charge
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.cancellation.charge_rate * 100}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          cancellation: {
                            ...editedPolicies.cancellation,
                            charge_rate: Number(e.target.value) / 100,
                          },
                        })
                      }
                      min={0}
                      max={100}
                      step={5}
                      style={{ width: '100px' }}
                    />
                    <span>% of trip cost</span>
                  </div>
                ) : (
                  `${(policies.cancellation.charge_rate * 100).toFixed(0)}% of trip cost`
                )}
              </td>
              <td className={styles.tableCell}>
                Charge rate for late cancellations
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Corporate Discounts */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🏢 Corporate Discounts</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Tier</th>
              <th className={styles.tableHeaderCell}>Discount</th>
              <th className={styles.tableHeaderCell}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                <span className={styles.statusBadge} style={{
                  background: 'var(--color-success-alpha-20)',
                  color: 'var(--color-success)'
                }}>
                  Tier 1
                </span>
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.corporate_discounts.tier1 * 100}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          corporate_discounts: {
                            ...editedPolicies.corporate_discounts,
                            tier1: Number(e.target.value) / 100,
                          },
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
                  `${(policies.corporate_discounts.tier1 * 100).toFixed(0)}%`
                )}
              </td>
              <td className={styles.tableCell}>
                Standard corporate accounts
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                <span className={styles.statusBadge} style={{
                  background: 'var(--gradient-secondary)',
                  color: 'white'
                }}>
                  Tier 2
                </span>
              </td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Input
                      type="number"
                      value={policies.corporate_discounts.tier2 * 100}
                      onChange={(e) =>
                        setEditedPolicies({
                          ...editedPolicies,
                          corporate_discounts: {
                            ...editedPolicies.corporate_discounts,
                            tier2: Number(e.target.value) / 100,
                          },
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
                  `${(policies.corporate_discounts.tier2 * 100).toFixed(0)}%`
                )}
              </td>
              <td className={styles.tableCell}>
                Premium corporate accounts
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
        <h3 className={styles.exampleTitle}>Example: Corporate Tier 2 Booking</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£150.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Corporate Discount (Tier 2):</span>
          <span className={styles.exampleValue}>
            -{(policies.corporate_discounts.tier2 * 100).toFixed(0)}% (£
            {(150 * policies.corporate_discounts.tier2).toFixed(2)})
          </span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>After Discount:</span>
          <span className={styles.exampleValue}>
            £{(150 * (1 - policies.corporate_discounts.tier2)).toFixed(2)}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Final (Rounded {policies.rounding.direction}):</span>
          <span className={styles.exampleValue}>
            £{(() => {
              const afterDiscount = 150 * (1 - policies.corporate_discounts.tier2);
              const roundTo = policies.rounding.to;
              if (policies.rounding.direction === 'up') {
                return Math.ceil(afterDiscount / roundTo) * roundTo;
              } else if (policies.rounding.direction === 'down') {
                return Math.floor(afterDiscount / roundTo) * roundTo;
              } else {
                return Math.round(afterDiscount / roundTo) * roundTo;
              }
            })().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
