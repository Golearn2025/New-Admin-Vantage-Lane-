/**
 * Service Policies Tab Component
 * 
 * Displays and allows editing of service policies (waiting, multi-stop, minimums)
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { WaitingTimeSection } from './service-policies/WaitingTimeSection';
import { AdditionalServicesSection } from './service-policies/AdditionalServicesSection';
import { MinimumRequirementsSection } from './service-policies/MinimumRequirementsSection';
import { Save, Edit } from 'lucide-react';
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
      <WaitingTimeSection
        policies={policies}
        editedPolicies={editedPolicies}
        setEditedPolicies={setEditedPolicies}
        isEditing={isEditing}
      />

      {/* Additional Services */}
      <AdditionalServicesSection
        policies={policies}
        editedPolicies={editedPolicies}
        setEditedPolicies={setEditedPolicies}
      />

      {/* Minimum Requirements */}
      <MinimumRequirementsSection
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
