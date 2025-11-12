/**
 * Assign Driver Modal
 * 
 * Modal for assigning/reassigning driver to operator
 * Uses Modal + Select from ui-core - 100% reusable
 */

'use client';

import { useState } from 'react';
import { Modal, Select, Button } from '@vantage-lane/ui-core';
import { UserPlus } from 'lucide-react';
import type { DriverAssignment } from '../types';
import styles from './AssignDriverModal.module.css';

export interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (operatorId: string, notes: string) => void;
  driver: DriverAssignment | null;
  operators: Array<{ id: string; name: string; email: string }>;
  loading?: boolean;
}

export function AssignDriverModal({
  isOpen,
  onClose,
  onConfirm,
  driver,
  operators,
  loading = false,
}: AssignDriverModalProps) {
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!driver) return null;

  const handleConfirm = () => {
    if (!selectedOperator) return;
    onConfirm(selectedOperator, notes);
    setSelectedOperator('');
    setNotes('');
  };

  const handleClose = () => {
    setSelectedOperator('');
    setNotes('');
    onClose();
  };

  const operatorOptions = operators.map((op) => ({
    value: op.id,
    label: `${op.name} (${op.email})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={driver.operator_id ? 'Reassign Driver' : 'Assign Driver to Operator'}
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.driverInfo}>
          <UserPlus size={20} />
          <div>
            <div className={styles.driverName}>{driver.driver_name}</div>
            <div className={styles.driverEmail}>{driver.driver_email}</div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Select Operator <span className={styles.required}>*</span>
          </label>
          <Select
            options={operatorOptions}
            value={selectedOperator}
            onChange={(value) => setSelectedOperator(String(value))}
            placeholder="Choose an operator..."
            disabled={loading}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes (optional)</label>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this assignment..."
            rows={3}
            disabled={loading}
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedOperator || loading}
            loading={loading}
          >
            {driver.operator_id ? 'Reassign Driver' : 'Assign Driver'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
