/**
 * VehicleTab Component
 *
 * Driver vehicle information display - Main orchestrator
 * Refactored to <200 lines using modular components
 * 
 * ✅ Zero any types
 * ✅ Design tokens only  
 * ✅ UI-core components
 * ✅ Lucide-react icons
 * ✅ Architecture: features → entities
 */

import { createClient } from '@/lib/supabase/client';
import { updateVehicle } from '@entities/vehicle';
import { ErrorBanner } from '@vantage-lane/ui-core';
import { useEffect, useState } from 'react';

import styles from '../driver-profile.module.css';
import { useDriverVehicle } from '../hooks/useDriverVehicle';
import { VehicleActions } from './VehicleActions';
import { VehicleApprovalCard } from './VehicleApprovalCard';
import { VehicleDocumentsCard } from './VehicleDocumentsCard';
import { VehicleEditForm, type VehicleEditFormData } from './VehicleEditForm';
import { VehicleEmptyState } from './VehicleEmptyState';
import { VehicleInfoCard } from './VehicleInfoCard';

interface VehicleTabProps {
  driverId: string;
}

export function VehicleTab({ driverId }: VehicleTabProps) {
  const { vehicles, isLoading, error, mutate } = useDriverVehicle(driverId);
  const [adminId, setAdminId] = useState<string>('');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<VehicleEditFormData>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get admin user ID for permissions
  useEffect(() => {
    async function getAdminId() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setAdminId(user.id);
      }
    }
    getAdminId();
  }, []);

  // Handle vehicle editing logic
  const handleEditClick = (vehicle: (typeof vehicles)[0]) => {
    setEditingVehicleId(vehicle.id);
    setEditFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate,
      category: vehicle.category || '',
      passengerCapacity: vehicle.passengerCapacity || 0,
      luggageCapacity: vehicle.luggageCapacity || 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingVehicleId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const result = await updateVehicle({
        vehicleId: editingVehicleId!,
        ...editFormData,
      });

      if (result.success) {
        await mutate();
        setEditingVehicleId(null);
        setEditFormData({});
      } else {
        alert(`Failed to update: ${result.error}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVehicleClick = () => {
    alert(
      'Add Vehicle functionality - to be implemented.\n\nThis will open a modal to add a new vehicle for this driver.'
    );
  };

  // Error state
  if (error) {
    return <ErrorBanner message={error.message} actionLabel="Retry" onAction={mutate} />;
  }

  // Loading state
  if (isLoading) {
    return <div className={styles.loading}>Loading vehicle information...</div>;
  }

  // Empty state - no vehicles
  if (vehicles.length === 0) {
    return (
      <VehicleEmptyState adminId={adminId} onAddVehicleClick={handleAddVehicleClick} />
    );
  }

  // Main render - show vehicles
  return (
    <div className={styles.vehicleTab}>
      {vehicles.map((vehicle) => {
        // Show approval card for pending vehicles
        if (vehicle.approvalStatus === 'pending' && adminId) {
          return (
            <VehicleApprovalCard
              key={vehicle.id}
              vehicle={vehicle}
              adminId={adminId}
              onSuccess={() => mutate()}
            />
          );
        }

        const isEditing = editingVehicleId === vehicle.id;

        return (
          <div key={vehicle.id} style={{ marginBottom: 'var(--spacing-4)' }}>
            {isEditing ? (
              // Edit mode - use VehicleEditForm
              <VehicleEditForm
                formData={editFormData}
                isSaving={isSaving}
                onFormDataChange={setEditFormData}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {/* Vehicle Information Card */}
                <VehicleInfoCard
                  vehicle={vehicle}
                  adminId={adminId}
                  onEditClick={() => handleEditClick(vehicle)}
                />

                {/* Documents & Compliance Card */}
                <VehicleDocumentsCard vehicle={vehicle} />

                {/* Admin Actions */}
                <VehicleActions
                  vehicle={vehicle}
                  adminId={adminId}
                  onSuccess={() => mutate()}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
