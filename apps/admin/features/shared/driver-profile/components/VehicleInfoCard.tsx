/**
 * VehicleInfoCard Component
 * 
 * Displays basic vehicle information (category, make/model, license plate, color)
 */

import { Badge, Button, Card } from '@vantage-lane/ui-core';
import { Car, Edit2 } from 'lucide-react';
import styles from '../driver-profile.module.css';

interface Vehicle {
  id: string;
  category?: string | null;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string | null;
}

interface VehicleInfoCardProps {
  vehicle: Vehicle;
  adminId: string;
  onEditClick: () => void;
}

export function VehicleInfoCard({ vehicle, adminId, onEditClick }: VehicleInfoCardProps) {
  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-3)',
        }}
      >
        <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
          Vehicle Information
        </h3>
        {adminId && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 size={14} />}
            onClick={onEditClick}
          >
            Edit
          </Button>
        )}
      </div>

      {/* Category */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Category</span>
        </div>
        <Badge color="theme" size="md">
          {vehicle.category || 'Standard'}
        </Badge>
      </div>

      {/* Make & Model */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Make & Model</span>
        </div>
        <span className={styles.value}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </span>
      </div>

      {/* License Plate */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>License Plate</span>
        </div>
        <span className={styles.value}>{vehicle.licensePlate}</span>
      </div>

      {/* Color */}
      {vehicle.color && (
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Car size={16} />
            <span>Color</span>
          </div>
          <span className={styles.value}>{vehicle.color}</span>
        </div>
      )}
    </Card>
  );
}
