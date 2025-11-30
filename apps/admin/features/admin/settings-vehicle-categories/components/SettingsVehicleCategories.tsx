/**
 * SettingsVehicleCategories Component
 * 
 * Manage vehicle categories (EXEC, LUX, VAN, SUV)
 * Used for driver assignments and booking filtering
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { Car, Gem, Bus, Truck } from 'lucide-react';
import { useSettingsVehicleCategories } from '../hooks/useSettingsVehicleCategories';
import type { VehicleCategory } from '../types';
import styles from './SettingsVehicleCategories.module.css';

export function SettingsVehicleCategories() {
  const { categories, loading, updateCategory, saveChanges } = useSettingsVehicleCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEdit = (category: VehicleCategory) => {
    setEditingId(category.id);
  };

  const handleSave = async (categoryId: string) => {
    setEditingId(null);
    setHasChanges(true);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSaveAll = async () => {
    await saveChanges();
    setHasChanges(false);
  };

  const getCategoryIcon = (code: string) => {
    const icons: Record<string, React.ReactNode> = {
      EXEC: <Car className="h-6 w-6" />,
      LUX: <Gem className="h-6 w-6" />,
      VAN: <Bus className="h-6 w-6" />,
      SUV: <Truck className="h-6 w-6" />,
    };
    return icons[code] || <Car className="h-6 w-6" />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vehicle Categories</h1>
          <p className={styles.subtitle}>
            Manage vehicle categories for driver assignments and booking filtering
          </p>
        </div>
        {hasChanges && (
          <Button variant="primary" onClick={handleSaveAll}>
            Save Changes
          </Button>
        )}
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {!loading && (
        <div className={styles.grid}>
          {categories.map((category) => {
            const isEditing = editingId === category.id;
            
            return (
              <div key={category.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.icon}>{getCategoryIcon(category.code)}</span>
                  <h3 className={styles.cardTitle}>{category.code}</h3>
                  <span className={category.isActive ? styles.active : styles.inactive}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  {isEditing ? (
                    <div className={styles.form}>
                      <div className={styles.formGroup}>
                        <label>Category Name</label>
                        <Input
                          type="text"
                          defaultValue={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Description</label>
                        <Input
                          type="text"
                          defaultValue={category.description}
                          onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Price Multiplier</label>
                        <Input
                          type="number"
                          step="0.1"
                          defaultValue={category.priceMultiplier}
                          onChange={(e) => updateCategory(category.id, { priceMultiplier: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={styles.name}>{category.name}</p>
                      <p className={styles.description}>{category.description}</p>
                      <div className={styles.meta}>
                        <span className={styles.multiplier}>
                          Multiplier: {category.priceMultiplier}x
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => handleSave(category.id)}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(category)}>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.info}>
        <h3>How It Works</h3>
        <ul>
          <li><strong>EXEC:</strong> Standard executive vehicles (Mercedes S-Class, BMW 7 Series)</li>
          <li><strong>LUX:</strong> Premium luxury vehicles (Bentley, Rolls-Royce)</li>
          <li><strong>VAN:</strong> Large group transport (Mercedes Sprinter, Transit)</li>
          <li><strong>SUV:</strong> SUV vehicles (Range Rover, Audi Q7)</li>
        </ul>
        <p className={styles.note}>
          Drivers are assigned categories when activated. They will only see bookings matching their assigned categories.
        </p>
      </div>
    </div>
  );
}
