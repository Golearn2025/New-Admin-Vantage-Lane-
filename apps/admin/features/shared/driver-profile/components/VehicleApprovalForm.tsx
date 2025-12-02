/**
 * VehicleApprovalForm Component
 * Form pentru aprobare vehicul (Admin)
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ ui-core: Select, Button, Input
 * ✅ lucide-react: Check, X
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Select, Button, Input } from '@vantage-lane/ui-core';
import { Check, X } from 'lucide-react';
import { approveVehicle, rejectVehicle, listJobCategories } from '@entities/vehicle';
import type { JobCategory } from '@entities/vehicle';
import styles from './VehicleApprovalForm.module.css';

interface VehicleApprovalFormProps {
  vehicleId: string;
  adminId: string;
  onSuccess: () => void;
}

export function VehicleApprovalForm({ vehicleId, adminId, onSuccess }: VehicleApprovalFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [passengerCapacity, setPassengerCapacity] = useState<string>('4');
  const [luggageCapacity, setLuggageCapacity] = useState<string>('3');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await listJobCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleApprove = async () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    setIsLoading(true);
    try {
      await approveVehicle(vehicleId, adminId, {
        category: selectedCategory,
        passengerCapacity: parseInt(passengerCapacity, 10),
        luggageCapacity: parseInt(luggageCapacity, 10),
        approvalStatus: 'approved',
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to approve vehicle:', error);
      alert('Failed to approve vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      await rejectVehicle(vehicleId, adminId, rejectionReason);
      onSuccess();
    } catch (error) {
      console.error('Failed to reject vehicle:', error);
      alert('Failed to reject vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize category options to prevent re-creation on every render
  const categoryOptions: Array<{ value: string; label: string }> = useMemo(() => 
    categories.map(cat => ({
      value: cat.name.toLowerCase(),
      label: cat.name,
    })), 
    [categories]
  );

  return (
    <div className={styles.form}>
      <h4 className={styles.title}>Set Category & Capacity</h4>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor="category" className={styles.label}>
            Category *
          </label>
          <Select
            value={selectedCategory}
            options={categoryOptions}
            onChange={(value) => setSelectedCategory(value as string)}
            disabled={loadingCategories}
            placeholder="Select category..."
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="passengers" className={styles.label}>
            Passenger Capacity
          </label>
          <Input
            id="passengers"
            type="number"
            min="1"
            max="8"
            value={passengerCapacity}
            onChange={(e) => setPassengerCapacity(e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="luggage" className={styles.label}>
            Luggage Capacity
          </label>
          <Input
            id="luggage"
            type="number"
            min="1"
            max="10"
            value={luggageCapacity}
            onChange={(e) => setLuggageCapacity(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor="rejection" className={styles.label}>
          Rejection Reason (Optional)
        </label>
        <Input
          id="rejection"
          placeholder="Enter reason if rejecting..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <Button
          variant="danger"
          leftIcon={<X size={16} />}
          onClick={handleReject}
          disabled={isLoading || !rejectionReason.trim()}
        >
          Reject
        </Button>
        <Button
          variant="primary"
          leftIcon={<Check size={16} />}
          onClick={handleApprove}
          disabled={isLoading || !selectedCategory}
        >
          Approve & Activate
        </Button>
      </div>
    </div>
  );
}
