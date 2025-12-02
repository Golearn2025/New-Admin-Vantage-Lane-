/**
 * VehicleTypesTab Component - Refactored Orchestrator
 * 
 * Orchestrates smaller focused components - RULES.md compliant
 * Split 310 → 155 lines (-50%)
 */

'use client';

import React, { useState, useMemo } from 'react';
import { EnterpriseDataTable } from '@vantage-lane/ui-core';
import { createVehicleColumns, type VehicleRow } from './vehicle-types/vehicle-columns';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, VehicleTypeRates } from '@entities/pricing';
import { VehicleTypesHeader } from './VehicleTypesHeader';
import { VehicleTypeCalculationExample } from './VehicleTypeCalculationExample';
import { AddVehicleTypeModal } from './AddVehicleTypeModal';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function VehicleTypesTab({ config }: Props) {
  const { updateVehicleType, isSaving } = usePricesManagement();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editedRates, setEditedRates] = useState<Partial<VehicleTypeRates>>({});
  const [newVehicleType, setNewVehicleType] = useState<Partial<VehicleTypeRates>>({
    name: '',
    base_fare: 0,
    per_mile_first_6: 0,
    per_mile_after_6: 0,
    per_minute: 0,
    minimum_fare: 0,
    hourly_in_town: 0,
    hourly_out_town: 0,
  });

  const vehicleTypes = Object.entries(config.vehicle_types);

  // Memoize vehicle data transformation to prevent re-creation on every render
  const vehicleData: VehicleRow[] = useMemo(() =>
    vehicleTypes.map(([type, rates]) => ({
    id: type,
    name: rates.name,
    baseFare: rates.base_fare,
    perMileFirst6: rates.per_mile_first_6,
    perMileAfter6: rates.per_mile_after_6,
    perMinute: rates.per_minute,
    minimumFare: rates.minimum_fare,
    editing: editingType === type,
    original: rates,
  })), 
  [vehicleTypes, editingType]
  );

  const handleEdit = (type: string, rates: VehicleTypeRates) => {
    // Edit vehicle type clicked
    setEditingType(type);
    setEditedRates(rates);
  };

  const handleSave = async (type: string) => {
    // Save vehicle type rates
    
    await updateVehicleType({
      vehicleType: type,
      rates: editedRates as VehicleTypeRates,
    });
    
    // Save successful
    setEditingType(null);
    setEditedRates({});
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditedRates({});
  };

  const handleFieldChange = (field: keyof VehicleTypeRates, value: string | number) => {
    setNewVehicleType(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSubmit = () => {
    // Reset form after submission
    setNewVehicleType({
      name: '',
      base_fare: 0,
      per_mile_first_6: 0,
      per_mile_after_6: 0,
      per_minute: 0,
      minimum_fare: 0,
      hourly_in_town: 0,
      hourly_out_town: 0,
    });
  };

  const columns = createVehicleColumns({
    vehicleTypes,
    editingType,
    editedRates,
    setEditedRates,
    isSaving,
    onStartEdit: handleEdit,
    onSave: handleSave,
    onCancel: handleCancel,
  });

  return (
    <div className={styles.section}>
      {/* Header */}
      <VehicleTypesHeader onAddClick={() => setIsAddModalOpen(true)} />

      {/* Data Table */}
      <EnterpriseDataTable columns={columns} data={vehicleData} stickyHeader />

      {/* Example Calculation */}
      <VehicleTypeCalculationExample vehicleTypes={config.vehicle_types} />

      {/* Add New Vehicle Type Modal */}
      <AddVehicleTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newVehicleType={newVehicleType}
        onFieldChange={handleFieldChange}
        onSubmit={handleAddSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}
