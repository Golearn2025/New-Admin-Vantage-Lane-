/**
 * VehicleEmptyState Component
 * 
 * Displays empty state when driver has no vehicles assigned
 */

import { Button, Card } from '@vantage-lane/ui-core';
import { Car, Plus } from 'lucide-react';
import styles from '../driver-profile.module.css';

interface VehicleEmptyStateProps {
  adminId: string;
  onAddVehicleClick: () => void;
}

export function VehicleEmptyState({ adminId, onAddVehicleClick }: VehicleEmptyStateProps) {
  return (
    <Card>
      <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
        <Car
          size={48}
          style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--spacing-4)' }}
        />
        <p className={styles.emptyMessage} style={{ marginBottom: 'var(--spacing-4)' }}>
          No vehicle assigned to this driver yet.
        </p>
        {adminId && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={16} />}
            onClick={onAddVehicleClick}
          >
            Add Vehicle
          </Button>
        )}
      </div>
    </Card>
  );
}
