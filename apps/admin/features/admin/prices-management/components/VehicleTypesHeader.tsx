/**
 * VehicleTypesHeader Component
 * 
 * Header section for vehicle types tab - focused on title and add button
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Plus } from 'lucide-react';
import styles from './PricesManagementPage.module.css';

interface VehicleTypesHeaderProps {
  onAddClick: () => void;
}

export function VehicleTypesHeader({ onAddClick }: VehicleTypesHeaderProps) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 'var(--spacing-4)' 
    }}>
      <div>
        <h2 className={styles.sectionTitle}>Vehicle Type Rates</h2>
        <p className={styles.sectionDescription}>
          Configure base fares, per-mile rates, and hourly rates for each vehicle type
        </p>
      </div>
      <Button variant="primary" onClick={onAddClick}>
        <Plus className="h-4 w-4" /> Add Vehicle Type
      </Button>
    </div>
  );
}
