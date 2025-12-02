/**
 * General Policies Tab Component
 * 
 * Displays and allows editing of general policies (rounding, cancellation, corporate discounts)
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { RoundingPolicy } from './general-policies/RoundingPolicy';
import { CancellationPolicy } from './general-policies/CancellationPolicy';
import { CorporateDiscounts } from './general-policies/CorporateDiscounts';
import { Save, Edit } from 'lucide-react';
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

      <RoundingPolicy
        policies={policies}
        editedPolicies={editedPolicies}
        setEditedPolicies={setEditedPolicies}
        isEditing={isEditing}
      />

      <CancellationPolicy
        policies={policies}
        editedPolicies={editedPolicies}
        setEditedPolicies={setEditedPolicies}
        isEditing={isEditing}
      />

      <CorporateDiscounts
        policies={policies}
        editedPolicies={editedPolicies}
        setEditedPolicies={setEditedPolicies}
      />

      {/* Actions */}
      <div className={styles.actionsContainer}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" /> Save All Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" /> Edit Policies
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
