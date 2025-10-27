/**
 * Add Price Item Modal - PREMIUM
 * 
 * Modal pentru adăugare vehicle types, airport fees, etc.
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import styles from './AddPriceItemModal.module.css';

interface Props {
  type: 'vehicle' | 'airport' | 'multiplier' | 'service';
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

export function AddPriceItemModal({ type, isOpen, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'vehicle':
        return (
          <>
            <Input
              label="Vehicle Name"
              placeholder="e.g., Luxury SUV"
              value={formData.name as string}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Base Fare (£)"
              type="number"
              placeholder="70"
              value={formData.base_fare as number}
              onChange={(e) => setFormData({ ...formData, base_fare: Number(e.target.value) })}
            />
            <Input
              label="Per Mile (First 6) (£)"
              type="number"
              step="0.1"
              placeholder="2.8"
              value={formData.per_mile_first_6 as number}
              onChange={(e) =>
                setFormData({ ...formData, per_mile_first_6: Number(e.target.value) })
              }
            />
          </>
        );
      case 'airport':
        return (
          <>
            <Input
              label="Airport Code"
              placeholder="e.g., LGW"
              value={formData.code as string}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Input
              label="Airport Name"
              placeholder="e.g., London Gatwick"
              value={formData.name as string}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Pickup Fee (£)"
              type="number"
              placeholder="10"
              value={formData.pickup_fee as number}
              onChange={(e) => setFormData({ ...formData, pickup_fee: Number(e.target.value) })}
            />
            <Input
              label="Dropoff Fee (£)"
              type="number"
              placeholder="5"
              value={formData.dropoff_fee as number}
              onChange={(e) => setFormData({ ...formData, dropoff_fee: Number(e.target.value) })}
            />
          </>
        );
      default:
        return null;
    }
  };

  const titles = {
    vehicle: '🚗 Add New Vehicle Type',
    airport: '✈️ Add New Airport',
    multiplier: '📈 Add New Multiplier',
    service: '⭐ Add Premium Service',
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{titles[type]}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>{renderFields()}</div>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : '✓ Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
