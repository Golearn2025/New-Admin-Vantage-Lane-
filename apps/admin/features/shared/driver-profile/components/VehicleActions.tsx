/**
 * VehicleActions Component
 * 
 * Admin actions for vehicle management (approve, revoke, delete)
 * Includes delete confirmation dialog
 */

import { deleteVehicle } from '@entities/vehicle';
import { Button, Card, ConfirmDialog } from '@vantage-lane/ui-core';
import { CheckCircle, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import styles from '../driver-profile.module.css';

interface Vehicle {
  id: string;
  licensePlate: string;
  approvalStatus: string;
}

interface VehicleActionsProps {
  vehicle: Vehicle;
  adminId: string;
  onSuccess: () => void;
}

export function VehicleActions({ vehicle, adminId, onSuccess }: VehicleActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteVehicle({ vehicleId: vehicle.id });

      if (result.success) {
        await onSuccess();
        setDeleteDialogOpen(false);
      } else {
        alert(`Failed to delete vehicle: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(
        `Error deleting vehicle: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = () => {
    alert('Approve vehicle - to be implemented');
  };

  const handleRevoke = () => {
    alert('Revoke approval - to be implemented');
  };

  if (!adminId) {
    return null;
  }

  return (
    <>
      <Card>
        <h3 className={styles.sectionTitle}>Admin Actions</h3>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            marginTop: 'var(--spacing-3)',
            flexWrap: 'wrap',
          }}
        >
          {vehicle.approvalStatus === 'approved' && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<XCircle size={16} />}
              onClick={handleRevoke}
            >
              Revoke Approval
            </Button>
          )}
          {vehicle.approvalStatus === 'rejected' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle size={16} />}
              onClick={handleApprove}
            >
              Approve Vehicle
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={handleDeleteClick}
          >
            Delete Vehicle
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle ${vehicle.licensePlate}? This action cannot be undone and will also delete all associated documents.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
