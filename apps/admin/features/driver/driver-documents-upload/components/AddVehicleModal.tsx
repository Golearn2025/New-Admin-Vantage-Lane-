/**
 * Add Vehicle Modal
 * 
 * Modal for adding new vehicle with form
 * 100% UI-core components
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input, Select } from '@vantage-lane/ui-core';
import { VEHICLE_YEARS, VEHICLE_COLORS, VEHICLE_MAKES, getModelsForMake } from '@entities/vehicle';
import styles from './AddVehicleModal.module.css';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: VehicleFormData) => Promise<void>;
}

export interface VehicleFormData {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
}


export function AddVehicleModal({ isOpen, onClose, onAdd }: AddVehicleModalProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: '',
    make: '',
    model: '',
    year: 2024,
    color: '',
  });
  const [availableModels, setAvailableModels] = useState<Array<{ value: string; label: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof VehicleFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    
    // When make changes, update available models
    if (field === 'make') {
      const models = getModelsForMake(value as string);
      setAvailableModels(models);
      // Reset model if make changed
      setFormData(prev => ({ ...prev, model: '' }));
    }
  };

  // Update models when make changes on mount
  useEffect(() => {
    if (formData.make) {
      const models = getModelsForMake(formData.make);
      setAvailableModels(models);
    }
  }, [formData.make]);

  // Memoize year options to prevent re-creation on every render
  const yearOptions = useMemo(() => 
    VEHICLE_YEARS.map(y => ({ value: y.toString(), label: y.toString() })),
    []
  );

  const validateForm = (): string | null => {
    if (!formData.licensePlate.trim()) return 'License plate is required';
    if (!formData.make.trim()) return 'Make is required';
    if (!formData.model.trim()) return 'Model is required';
    if (!formData.color.trim()) return 'Color is required';
    return null;
  };

  const handleSubmit = async () => {
    console.log('📦 [AddVehicleModal] handleSubmit called');
    console.log('📦 [AddVehicleModal] formData:', formData);
    
    const validationError = validateForm();
    if (validationError) {
      console.error('❌ [AddVehicleModal] Validation error:', validationError);
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      console.log('🚀 [AddVehicleModal] Calling onAdd...');
      await onAdd(formData);
      
      console.log('✅ [AddVehicleModal] Vehicle added successfully!');
      resetForm();
      onClose();
    } catch (err) {
      console.error('❌ [AddVehicleModal] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      licensePlate: '',
      make: '',
      model: '',
      year: 2024,
      color: '',
    });
    setAvailableModels([]);
    setError('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Vehicle"
      size="md"
    >
      <div className={styles.container}>
        <div className={styles.field}>
          <label className={styles.label}>License Plate *</label>
          <Input
            value={formData.licensePlate}
            onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
            placeholder="ABC123"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Make *</label>
            <Select
              value={formData.make}
              options={VEHICLE_MAKES}
              onChange={(value) => handleChange('make', value.toString())}
              placeholder="Select make..."
              disabled={isSubmitting}
              fullWidth
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Model *</label>
            <Select
              value={formData.model}
              options={availableModels}
              onChange={(value) => handleChange('model', value.toString())}
              placeholder="Select model..."
              disabled={isSubmitting || !formData.make}
              fullWidth
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Year *</label>
            <Select
              value={formData.year.toString()}
              onChange={(value) => handleChange('year', parseInt(value.toString()))}
              options={yearOptions}
              disabled={isSubmitting}
              fullWidth
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color *</label>
            <Select
              value={formData.color}
              options={VEHICLE_COLORS}
              onChange={(value) => handleChange('color', value.toString())}
              placeholder="Select color..."
              disabled={isSubmitting}
              fullWidth
            />
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            onClick={handleClose}
            variant="outline"
            size="md"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="md"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
