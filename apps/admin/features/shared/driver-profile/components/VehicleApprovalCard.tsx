/**
 * VehicleApprovalCard Component
 * Wrapper component - composing VehicleDetails and VehicleApprovalForm
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ ui-core: Card
 * ✅ Sub-components < 200 lines each
 */

'use client';

import React from 'react';
import { Card } from '@vantage-lane/ui-core';
import { VehicleDetails } from './VehicleDetails';
import { VehicleApprovalForm } from './VehicleApprovalForm';
import type { VehicleApproval } from '@entities/vehicle';
import styles from './VehicleApprovalCard.module.css';

interface VehicleApprovalCardProps {
  vehicle: VehicleApproval;
  adminId: string;
  onSuccess: () => void;
}

export function VehicleApprovalCard({ vehicle, adminId, onSuccess }: VehicleApprovalCardProps) {
  return (
    <Card>
      <VehicleDetails vehicle={vehicle} />
      
      {vehicle.approvalStatus === 'pending' && (
        <div className={styles.formSection}>
          <VehicleApprovalForm
            vehicleId={vehicle.id}
            adminId={adminId}
            onSuccess={onSuccess}
          />
        </div>
      )}
    </Card>
  );
}
