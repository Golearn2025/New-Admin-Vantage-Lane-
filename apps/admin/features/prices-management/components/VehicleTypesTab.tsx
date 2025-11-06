/**
 * Vehicle Types Tab Component
 * 
 * Displays and allows editing of vehicle type rates
 */

'use client';

import React, { useState } from 'react';
import { Button, EnterpriseDataTable } from '@vantage-lane/ui-core';
import { createVehicleColumns, type VehicleRow } from './vehicle-types/vehicle-columns';
import { BarChart3, Banknote } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, VehicleTypeRates } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function VehicleTypesTab({ config }: Props) {
  const { updateVehicleType, isSaving } = usePricesManagement();
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editedRates, setEditedRates] = useState<Partial<VehicleTypeRates>>({});

  const vehicleTypes = Object.entries(config.vehicle_types);

  const vehicleData: VehicleRow[] = vehicleTypes.map(([type, rates]) => ({
    id: type,
    name: rates.name,
    baseFare: rates.base_fare,
    perMileFirst6: rates.per_mile_first_6,
    perMileAfter6: rates.per_mile_after_6,
    perMinute: rates.per_minute,
    minimumFare: rates.minimum_fare,
  }));

  const handleEdit = (type: string, rates: VehicleTypeRates) => {
    setEditingType(type);
    setEditedRates(rates);
  };

  const handleSave = async (type: string) => {
    try {
      await updateVehicleType({
        vehicleType: type,
        rates: editedRates,
      });
      setEditingType(null);
      setEditedRates({});
    } catch (error) {
      console.error('Failed to save:', error);
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditedRates({});
  };

  const columns = createVehicleColumns({
    editingType,
    editedRates,
    setEditedRates,
    setEditingType,
    handleSave,
    handleCancel,
    vehicleTypes,
    isSaving,
    onStartEdit: handleEdit,
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
      <h2 className={styles.sectionTitle}>Vehicle Type Rates</h2>
      <p className={styles.sectionDescription}>
        Configure base fares, per-mile rates, and hourly rates for each vehicle type
      </p>

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
                  <span className={styles.exampleValue}>£{example.baseFare.toFixed(2)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Distance Fee:</span>
                  <span className={styles.exampleValue}>£{example.distanceFee.toFixed(2)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Time Fee:</span>
                  <span className={styles.exampleValue}>£{example.timeFee.toFixed(2)}</span>
                </div>
                <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
                  <span className={styles.exampleLabel}>Customer Total:</span>
                  <span className={styles.exampleValue}>£{customerPrice.toFixed(2)}</span>
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
                  <span className={`${styles.exampleValue} ${styles.textPrimary}`}>£{platformFee.toFixed(2)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Operator Net:</span>
                  <span className={styles.exampleValue}>£{operatorNet.toFixed(2)}</span>
                </div>
                <div className={styles.exampleRow}>
                  <span className={styles.exampleLabel}>Operator Commission (20%):</span>
                  <span className={`${styles.exampleValue} ${styles.textSuccess}`}>£{operatorCommissionAmount.toFixed(2)}</span>
                </div>
                <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
                  <span className={styles.exampleLabel}>Driver Payout (80%):</span>
                  <span className={`${styles.exampleValue} ${styles.textInfo}`}>£{driverPayout.toFixed(2)}</span>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
