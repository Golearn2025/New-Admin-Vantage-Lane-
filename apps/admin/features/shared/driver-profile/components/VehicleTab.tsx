/**
 * VehicleTab Component
 *
 * Driver vehicle information display
 */

import { createClient } from '@/lib/supabase/client';
import { deleteVehicle, updateVehicle } from '@entities/vehicle';
import {
  VEHICLE_COLORS,
  VEHICLE_MAKES,
  VEHICLE_YEARS,
  getModelsForMake,
} from '@entities/vehicle/constants/vehicleData';
import { Badge, Button, Card, ConfirmDialog, ErrorBanner, Input } from '@vantage-lane/ui-core';
import {
  Briefcase,
  Calendar,
  Car,
  CheckCircle,
  Edit2,
  Plus,
  Save,
  Shield,
  Trash2,
  Users,
  XCircle,
  X as XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Vehicle edit form data interface
interface VehicleEditFormData {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  seats?: number;
  isActive?: boolean;
  vehicleType?: string;
  category?: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
}
import styles from '../driver-profile.module.css';
import { useDriverVehicle } from '../hooks/useDriverVehicle';
import { VehicleApprovalCard } from './VehicleApprovalCard';

interface VehicleTabProps {
  driverId: string;
}

/**
 * Calculate days until expiry
 */
function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function VehicleTab({ driverId }: VehicleTabProps) {
  const { vehicles, isLoading, error, mutate } = useDriverVehicle(driverId);
  const [adminId, setAdminId] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<{
    id: string;
    licensePlate: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<VehicleEditFormData>({});
  const [isSaving, setIsSaving] = useState(false);

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

  if (error) {
    return <ErrorBanner message={error.message} actionLabel="Retry" onAction={mutate} />;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading vehicle information...</div>;
  }

  if (vehicles.length === 0) {
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
              onClick={() => {
                alert(
                  'Add Vehicle functionality - to be implemented.\n\nThis will open a modal to add a new vehicle for this driver.'
                );
              }}
            >
              Add Vehicle
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.vehicleTab}>
      {/* Show each vehicle */}
      {vehicles.map((vehicle) => {
        const insuranceExpiring = getDaysUntilExpiry(vehicle.insuranceExpiry) <= 30;
        const motExpiring = vehicle.motExpiry ? getDaysUntilExpiry(vehicle.motExpiry) <= 30 : false;

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

        // Handle edit mode toggle
        const handleEditClick = () => {
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
              vehicleId: vehicle.id,
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

        // Show vehicle details for approved/rejected vehicles
        return (
          <div key={vehicle.id} style={{ marginBottom: 'var(--spacing-4)' }}>
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
                {!isEditing && adminId && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit2 size={14} />}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                // EDIT MODE - Inline editing with DYNAMIC dropdowns
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {/* Make */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Make</span>
                    </div>
                    <select
                      value={editFormData.make}
                      onChange={(e) => {
                        const newMake = e.target.value;
                        setEditFormData({
                          ...editFormData,
                          make: newMake,
                          model: '', // Reset model when make changes
                        });
                      }}
                      style={{
                        maxWidth: '200px',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <option value="">Select make...</option>
                      {VEHICLE_MAKES.map((make) => (
                        <option key={make.value} value={make.label}>
                          {make.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model (depends on Make) */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Model</span>
                    </div>
                    <select
                      value={editFormData.model}
                      onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
                      disabled={!editFormData.make}
                      style={{
                        maxWidth: '200px',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <option value="">Select model...</option>
                      {editFormData.make &&
                        getModelsForMake(editFormData.make).map((model) => (
                          <option key={model.value} value={model.label}>
                            {model.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Year</span>
                    </div>
                    <select
                      value={editFormData.year}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, year: parseInt(e.target.value) })
                      }
                      style={{
                        maxWidth: '120px',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <option value="">Year...</option>
                      {VEHICLE_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* License Plate */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>License Plate</span>
                    </div>
                    <Input
                      type="text"
                      value={editFormData.licensePlate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          licensePlate: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="GL40KAT"
                      style={{ maxWidth: '150px' }}
                    />
                  </div>

                  {/* Color */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Color</span>
                    </div>
                    <select
                      value={editFormData.color}
                      onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                      style={{
                        maxWidth: '150px',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <option value="">Select color...</option>
                      {VEHICLE_COLORS.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Category</span>
                    </div>
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, category: e.target.value })
                      }
                      style={{
                        maxWidth: '200px',
                        padding: 'var(--spacing-2)',
                        borderRadius: 'var(--border-radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      <option value="">Select category...</option>
                      <option value="executive">Executive</option>
                      <option value="luxury">Luxury</option>
                      <option value="van">Van</option>
                      <option value="suv">SUV</option>
                    </select>
                  </div>

                  {/* Passenger Capacity */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Users size={16} />
                      <span>Passengers</span>
                    </div>
                    <Input
                      type="number"
                      value={editFormData.passengerCapacity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          passengerCapacity: parseInt(e.target.value) || 0,
                        })
                      }
                      min="1"
                      max="20"
                      style={{ maxWidth: '100px' }}
                    />
                  </div>

                  {/* Luggage Capacity */}
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Briefcase size={16} />
                      <span>Luggage</span>
                    </div>
                    <Input
                      type="number"
                      value={editFormData.luggageCapacity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          luggageCapacity: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      max="10"
                      style={{ maxWidth: '100px' }}
                    />
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-2)',
                      justifyContent: 'flex-end',
                      marginTop: 'var(--spacing-2)',
                      paddingTop: 'var(--spacing-3)',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<XIcon size={14} />}
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Save size={14} />}
                      onClick={handleSaveEdit}
                      loading={isSaving}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              ) : (
                // VIEW MODE - Display only
                <>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Category</span>
                    </div>
                    <Badge color="theme" size="md">
                      {vehicle.category || 'Standard'}
                    </Badge>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>Make & Model</span>
                    </div>
                    <span className={styles.value}>
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      <Car size={16} />
                      <span>License Plate</span>
                    </div>
                    <span className={styles.value}>{vehicle.licensePlate}</span>
                  </div>
                  {vehicle.color && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoLabel}>
                        <Car size={16} />
                        <span>Color</span>
                      </div>
                      <span className={styles.value}>{vehicle.color}</span>
                    </div>
                  )}
                </>
              )}
            </Card>

            <Card>
              <h3 className={styles.sectionTitle}>Documents & Compliance</h3>
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

            {/* Admin Actions (available for all vehicles) */}
            {!isEditing && adminId && (
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
                      onClick={() => {
                        alert('Revoke approval - to be implemented');
                      }}
                    >
                      Revoke Approval
                    </Button>
                  )}
                  {vehicle.approvalStatus === 'rejected' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle size={16} />}
                      onClick={() => {
                        alert('Approve vehicle - to be implemented');
                      }}
                    >
                      Approve Vehicle
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => {
                      setVehicleToDelete({ id: vehicle.id, licensePlate: vehicle.licensePlate });
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete Vehicle
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setVehicleToDelete(null);
        }}
        onConfirm={async () => {
          if (!vehicleToDelete) return;

          setIsDeleting(true);
          try {
            const result = await deleteVehicle({ vehicleId: vehicleToDelete.id });

            if (result.success) {
              // Refresh vehicle list
              await mutate();
              setDeleteDialogOpen(false);
              setVehicleToDelete(null);
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
        }}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle ${vehicleToDelete?.licensePlate}? This action cannot be undone and will also delete all associated documents.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
