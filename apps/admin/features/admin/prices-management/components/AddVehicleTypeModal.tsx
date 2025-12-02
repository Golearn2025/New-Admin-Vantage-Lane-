/**
 * AddVehicleTypeModal Component
 * 
 * Modal for adding new vehicle types - focused on form handling and submission
 */

'use client';

import React from 'react';
import { Modal, Input, Button } from '@vantage-lane/ui-core';
import { Save } from 'lucide-react';
import type { VehicleTypeRates } from '@entities/pricing';

interface AddVehicleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newVehicleType: Partial<VehicleTypeRates>;
  onFieldChange: (field: keyof VehicleTypeRates, value: string | number) => void;
  onSubmit: () => void;
  isSaving: boolean;
}

export function AddVehicleTypeModal({
  isOpen,
  onClose,
  newVehicleType,
  onFieldChange,
  onSubmit,
  isSaving
}: AddVehicleTypeModalProps) {
  
  const handleSubmit = async () => {
    console.log('🆕 Add New Vehicle Type:', newVehicleType);
    alert('Add New functionality - Coming soon!');
    // TODO: Implement add new vehicle type API
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Vehicle Type"
      size="lg"
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--spacing-4)' 
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Vehicle Name
          </label>
          <Input
            type="text"
            value={newVehicleType.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="e.g., Premium SUV"
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Base Fare (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.base_fare || 0}
            onChange={(e) => onFieldChange('base_fare', Number(e.target.value))}
            min={0}
            step={1}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Per Mile First 6 (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.per_mile_first_6 || 0}
            onChange={(e) => onFieldChange('per_mile_first_6', Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Per Mile After 6 (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.per_mile_after_6 || 0}
            onChange={(e) => onFieldChange('per_mile_after_6', Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Per Minute (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.per_minute || 0}
            onChange={(e) => onFieldChange('per_minute', Number(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Minimum Fare (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.minimum_fare || 0}
            onChange={(e) => onFieldChange('minimum_fare', Number(e.target.value))}
            min={0}
            step={1}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Hourly In Town (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.hourly_in_town || 0}
            onChange={(e) => onFieldChange('hourly_in_town', Number(e.target.value))}
            min={0}
            step={5}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-2)', 
            fontSize: 'var(--font-size-sm)', 
            fontWeight: 500 
          }}>
            Hourly Out Town (£)
          </label>
          <Input
            type="number"
            value={newVehicleType.hourly_out_town || 0}
            onChange={(e) => onFieldChange('hourly_out_town', Number(e.target.value))}
            min={0}
            step={5}
          />
        </div>

        <div style={{ 
          gridColumn: '1 / -1', 
          display: 'flex', 
          gap: 'var(--spacing-3)', 
          justifyContent: 'flex-end', 
          marginTop: 'var(--spacing-4)' 
        }}>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSaving || !newVehicleType.name}
          >
            <Save className="h-4 w-4" /> Add Vehicle Type
          </Button>
        </div>
      </div>
    </Modal>
  );
}
