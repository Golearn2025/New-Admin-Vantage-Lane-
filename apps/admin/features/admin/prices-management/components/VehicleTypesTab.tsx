/**
 * Vehicle Types Tab Component
 * 
 * Displays and allows editing of vehicle type rates
 */

'use client';

import React, { useState, useMemo } from 'react';
import { EnterpriseDataTable, Modal, Input, Button } from '@vantage-lane/ui-core';
import { createVehicleColumns, type VehicleRow } from './vehicle-types/vehicle-columns';
import { BarChart3, Banknote, Plus, RefreshCw, Save } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatters';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, VehicleTypeRates } from '@entities/pricing';
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
    console.log('🎯 Edit clicked:', type);
    setEditingType(type);
    setEditedRates(rates);
  };

  const handleSave = async (type: string) => {
    console.log('🔵 VehicleTypesTab: handleSave called');
    console.log('🔵 Vehicle type:', type);
    console.log('🔵 Edited rates:', editedRates);
    
    await updateVehicleType({
      vehicleType: type,
      rates: editedRates as VehicleTypeRates,
    });
    
    console.log('✅ Save successful!');
    setEditingType(null);
    setEditedRates({});
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditedRates({});
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

  const calculateExample = (rates: VehicleTypeRates) => {
    const distance = 15.5; // miles
    const duration = 45; // minutes
    const first6 = Math.min(distance, 6) * rates.per_mile_first_6;
    const remaining = Math.max(distance - 6, 0) * rates.per_mile_after_6;
    const distanceFee = first6 + remaining;
    const timeFee = duration * rates.per_minute;
    const total = rates.base_fare + distanceFee + timeFee;

    return {
      baseFare: rates.base_fare,
      distanceFee,
      timeFee,
      total: Math.max(total, rates.minimum_fare),
    };
  };

  return (
    <div className={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h2 className={styles.sectionTitle}>Vehicle Type Rates</h2>
          <p className={styles.sectionDescription}>
            Configure base fares, per-mile rates, and hourly rates for each vehicle type
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Vehicle Type
        </Button>
      </div>

      <EnterpriseDataTable columns={columns} data={vehicleData} stickyHeader />

      {/* Example Calculation with Commissions */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example Calculation (Executive) - 15.5 miles, 45 min</h3>
        {config.vehicle_types.executive && (() => {
          const example = calculateExample(config.vehicle_types.executive!);
          const platformCommission = 0.10; // 10%
          const operatorCommission = 0.20; // 20%
          
          const customerPrice = example.total;
          const platformFee = customerPrice * platformCommission;
          const operatorNet = customerPrice - platformFee;
          const operatorCommissionAmount = operatorNet * operatorCommission;
          const driverPayout = operatorNet - operatorCommissionAmount;
          
          return (
            <>
              <div className={styles.exampleSection}>
                <h4 className={styles.exampleSubtitle}>
                  <div className={styles.flexRow}>
                    <Banknote className="h-4 w-4" />
                    Customer Pays:
                  </div>
                </h4>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Base Fare:</span>
                  <span className={styles.exampleValue}>{formatCurrency(example.baseFare)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Distance Fee:</span>
                  <span className={styles.exampleValue}>{formatCurrency(example.distanceFee)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Time Fee:</span>
                  <span className={styles.exampleValue}>{formatCurrency(example.timeFee)}</span>
                </div>
                <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
                  <span className={styles.exampleLabel}>Customer Total:</span>
                  <span className={styles.exampleValue}>{formatCurrency(customerPrice)}</span>
                </div>
              </div>

              <div className={styles.exampleSection}>
                <h4 className={styles.exampleSubtitle}>
                  <div className={styles.flexRow}>
                    <BarChart3 className="h-4 w-4" />
                    Commission Breakdown:
                  </div>
                </h4>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Platform Fee (10%):</span>
                  <span className={`${styles.exampleValue} ${styles.textPrimary}`}>{formatCurrency(platformFee)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Operator Net:</span>
                  <span className={styles.exampleValue}>{formatCurrency(operatorNet)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Operator Commission (20%):</span>
                  <span className={`${styles.exampleValue} ${styles.textSuccess}`}>{formatCurrency(operatorCommissionAmount)}</span>
                </div>
                <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
                  <span className={styles.exampleLabel}>Driver Payout (80%):</span>
                  <span className={`${styles.exampleValue} ${styles.textInfo}`}>{formatCurrency(driverPayout)}</span>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Add New Vehicle Type Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Vehicle Type"
        size="lg"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Vehicle Name</label>
            <Input
              type="text"
              value={newVehicleType.name}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, name: e.target.value })}
              placeholder="e.g., Premium SUV"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Base Fare (£)</label>
            <Input
              type="number"
              value={newVehicleType.base_fare}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, base_fare: Number(e.target.value) })}
              min={0}
              step={1}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Per Mile First 6 (£)</label>
            <Input
              type="number"
              value={newVehicleType.per_mile_first_6}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, per_mile_first_6: Number(e.target.value) })}
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Per Mile After 6 (£)</label>
            <Input
              type="number"
              value={newVehicleType.per_mile_after_6}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, per_mile_after_6: Number(e.target.value) })}
              min={0}
              step={0.1}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Per Minute (£)</label>
            <Input
              type="number"
              value={newVehicleType.per_minute}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, per_minute: Number(e.target.value) })}
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Minimum Fare (£)</label>
            <Input
              type="number"
              value={newVehicleType.minimum_fare}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, minimum_fare: Number(e.target.value) })}
              min={0}
              step={1}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Hourly In Town (£)</label>
            <Input
              type="number"
              value={newVehicleType.hourly_in_town}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, hourly_in_town: Number(e.target.value) })}
              min={0}
              step={5}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Hourly Out Town (£)</label>
            <Input
              type="number"
              value={newVehicleType.hourly_out_town}
              onChange={(e) => setNewVehicleType({ ...newVehicleType, hourly_out_town: Number(e.target.value) })}
              min={0}
              step={5}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', marginTop: 'var(--spacing-4)' }}>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={async () => {
                console.log('🆕 Add New Vehicle Type:', newVehicleType);
                alert('Add New functionality - Coming soon!');
                // TODO: Implement add new vehicle type API
                setIsAddModalOpen(false);
              }} 
              disabled={isSaving || !newVehicleType.name}
            >
              <Save className="h-4 w-4" /> Add Vehicle Type
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
