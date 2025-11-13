/**
 * VehicleDetails Component
 * Display-only vehicle information
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ ui-core components (Badge)
 * ✅ lucide-react icons DOAR
 */

import React from 'react';
import { Badge } from '@vantage-lane/ui-core';
import { Check, AlertCircle } from 'lucide-react';
import type { VehicleApproval } from '@entities/vehicle';
import styles from './VehicleDetails.module.css';

interface VehicleDetailsProps {
  vehicle: VehicleApproval;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>Vehicle Details</h3>
        <Badge color={vehicle.approvalStatus === 'pending' ? 'warning' : 'neutral'}>
          {vehicle.approvalStatus}
        </Badge>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detail}>
          <span className={styles.label}>License Plate:</span>
          <span className={styles.value}>{vehicle.licensePlate}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Make:</span>
          <span className={styles.value}>{vehicle.make}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Model:</span>
          <span className={styles.value}>{vehicle.model}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Year:</span>
          <span className={styles.value}>{vehicle.year}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Color:</span>
          <span className={styles.value}>{vehicle.color || 'N/A'}</span>
        </div>
      </div>

      {vehicle.approvalStatus === 'rejected' && vehicle.rejectionReason && (
        <div className={styles.rejectionBanner}>
          <AlertCircle size={16} />
          <span>Rejected: {vehicle.rejectionReason}</span>
        </div>
      )}

      {vehicle.approvalStatus === 'approved' && (
        <div className={styles.approvedBanner}>
          <Check size={16} />
          <span>Vehicle approved and active</span>
        </div>
      )}
    </>
  );
}
