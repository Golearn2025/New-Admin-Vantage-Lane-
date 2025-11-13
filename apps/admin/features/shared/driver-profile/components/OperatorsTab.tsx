/**
 * OperatorsTab Component
 * 
 * Driver organization/operator assignment information
 */

import React from 'react';
import type { DriverProfileData } from '@entities/driver';
import { Card, Badge } from '@vantage-lane/ui-core';
import { Building2 } from 'lucide-react';
import styles from '../driver-profile.module.css';

interface OperatorsTabProps {
  driver: DriverProfileData;
}

export function OperatorsTab({ driver }: OperatorsTabProps) {
  if (!driver.organizationId || !driver.organizationName) {
    return (
      <Card>
        <p className={styles.emptyMessage}>
          This driver is not assigned to any operator yet.
        </p>
      </Card>
    );
  }

  return (
    <div className={styles.operatorsTab}>
      <Card>
        <h3 className={styles.sectionTitle}>Assigned Operator</h3>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Building2 size={16} />
            <span>Organization</span>
          </div>
          <span className={styles.value}>{driver.organizationName}</span>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Building2 size={16} />
            <span>Status</span>
          </div>
          <Badge color="success" size="sm">
            Active Assignment
          </Badge>
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Operator Actions</h3>
        <p className={styles.infoText}>
          To reassign this driver to a different operator, use the &quot;Assign Drivers to 
          Operators&quot; page.
        </p>
      </Card>
    </div>
  );
}
