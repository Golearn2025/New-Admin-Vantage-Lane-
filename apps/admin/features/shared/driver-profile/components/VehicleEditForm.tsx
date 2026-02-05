/**
 * VehicleEditForm Component
 * 
 * Edit form for vehicle information with dynamic dropdowns
 */

import { getModelsForMake, VEHICLE_COLORS, VEHICLE_MAKES, VEHICLE_YEARS } from '@entities/vehicle/constants/vehicleData';
import { Button, Input } from '@vantage-lane/ui-core';
import { Briefcase, Car, Save, Users, X as XIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import styles from '../driver-profile.module.css';

export interface VehicleEditFormData {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  category?: string;
  passengerCapacity?: number;
  luggageCapacity?: number;
}

interface VehicleEditFormProps {
  formData: VehicleEditFormData;
  isSaving: boolean;
  onFormDataChange: (data: VehicleEditFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function VehicleEditForm({
  formData,
  isSaving,
  onFormDataChange,
  onSave,
  onCancel,
}: VehicleEditFormProps) {
  // Optimized handlers with useCallback
  const handleMakeChange = useCallback((newMake: string) => {
    onFormDataChange({
      ...formData,
      make: newMake,
      model: '', // Reset model when make changes
    });
  }, [formData, onFormDataChange]);

  const handleFieldChange = useCallback((field: keyof VehicleEditFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  }, [formData, onFormDataChange]);

  // Memoized options to prevent re-creation on every render
  const makeOptions = useMemo(() => 
    VEHICLE_MAKES.map((make) => (
      <option key={make.value} value={make.label}>
        {make.label}
      </option>
    )), []
  );

  const modelOptions = useMemo(() => {
    if (!formData.make) return [];
    return getModelsForMake(formData.make).map((model) => (
      <option key={model.value} value={model.label}>
        {model.label}
      </option>
    ));
  }, [formData.make]);

  const yearOptions = useMemo(() => 
    VEHICLE_YEARS.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    )), []
  );

  const colorOptions = useMemo(() => 
    VEHICLE_COLORS.map((color) => (
      <option key={color.value} value={color.value}>
        {color.label}
      </option>
    )), []
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      {/* Make */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Make</span>
        </div>
        <select
          value={formData.make}
          onChange={(e) => handleMakeChange(e.target.value)}
          style={{
            maxWidth: '200px',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">Select make...</option>
          {makeOptions}
        </select>
      </div>

      {/* Model */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Model</span>
        </div>
        <select
          value={formData.model}
          onChange={(e) => handleFieldChange('model', e.target.value)}
          disabled={!formData.make}
          style={{
            maxWidth: '200px',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">Select model...</option>
          {modelOptions}
        </select>
      </div>

      {/* Year */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Year</span>
        </div>
        <select
          value={formData.year}
          onChange={(e) => handleFieldChange('year', parseInt(e.target.value))}
          style={{
            maxWidth: '120px',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">Year...</option>
          {yearOptions}
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
          value={formData.licensePlate}
          onChange={(e) =>
            handleFieldChange('licensePlate', e.target.value.toUpperCase())
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
          value={formData.color}
          onChange={(e) => handleFieldChange('color', e.target.value)}
          style={{
            maxWidth: '150px',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">Select color...</option>
          {colorOptions}
        </select>
      </div>

      {/* Category */}
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <Car size={16} />
          <span>Category</span>
        </div>
        <select
          value={formData.category}
          onChange={(e) => handleFieldChange('category', e.target.value)}
          style={{
            maxWidth: '200px',
            padding: 'var(--spacing-2)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <option value="">Select category...</option>
          <option value="exec">Executive</option>
          <option value="lux">Luxury</option>
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
          value={formData.passengerCapacity}
          onChange={(e) =>
            handleFieldChange('passengerCapacity', parseInt(e.target.value) || 0)
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
          value={formData.luggageCapacity}
          onChange={(e) =>
            handleFieldChange('luggageCapacity', parseInt(e.target.value) || 0)
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
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save size={14} />}
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
