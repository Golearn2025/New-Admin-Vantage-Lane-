/**
 * VehicleDocumentsCard Component
 * 
 * Displays vehicle documents and compliance information
 * Shows expiry dates and warnings
 */

import { Badge, Card } from '@vantage-lane/ui-core';
import { Calendar, Car, Shield } from 'lucide-react';
import { formatDate, getDaysUntilExpiry } from '../utils/vehicleHelpers';
import styles from '../driver-profile.module.css';

interface Vehicle {
  insuranceExpiry: string;
  motExpiry?: string | null;
  approvalStatus: string;
  isActive: boolean;
}

interface VehicleDocumentsCardProps {
  vehicle: Vehicle;
}

export function VehicleDocumentsCard({ vehicle }: VehicleDocumentsCardProps) {
  const insuranceExpiring = getDaysUntilExpiry(vehicle.insuranceExpiry) <= 30;
  const motExpiring = vehicle.motExpiry ? getDaysUntilExpiry(vehicle.motExpiry) <= 30 : false;

  return (
    <Card>
      <h3 className={styles.sectionTitle}>Documents & Compliance</h3>
      
      {/* Insurance Expiry */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Shield size={16} />
          <span>Insurance Expiry</span>
        </div>
        <div className={styles.expiryInfo}>
          <span className={styles.value}>{formatDate(vehicle.insuranceExpiry)}</span>
          {insuranceExpiring && (
            <Badge color="danger" size="sm">
              Expiring Soon
            </Badge>
          )}
        </div>
      </div>

      {/* MOT Expiry */}
      {vehicle.motExpiry && (
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Calendar size={16} />
            <span>MOT Expiry</span>
          </div>
          <div className={styles.expiryInfo}>
            <span className={styles.value}>{formatDate(vehicle.motExpiry)}</span>
            {motExpiring && (
              <Badge color="danger" size="sm">
                Expiring Soon
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Approval Status */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Approval Status</span>
        </div>
        <Badge
          color={
            vehicle.approvalStatus === 'approved'
              ? 'success'
              : vehicle.approvalStatus === 'rejected'
                ? 'danger'
                : 'warning'
          }
          size="sm"
        >
          {vehicle.approvalStatus}
        </Badge>
      </div>

      {/* Active Status */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Active Status</span>
        </div>
        <Badge color={vehicle.isActive ? 'success' : 'neutral'} size="sm">
          {vehicle.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    </Card>
  );
}
