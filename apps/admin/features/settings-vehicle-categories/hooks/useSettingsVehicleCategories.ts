/**
 * useSettingsVehicleCategories Hook
 */

'use client';

import { useState, useEffect } from 'react';
import type { VehicleCategory } from '../types';

const mockCategories: VehicleCategory[] = [
  {
    id: '1',
    code: 'EXEC',
    name: 'Executive',
    description: 'Standard executive vehicles (Mercedes S-Class, BMW 7 Series)',
    priceMultiplier: 1.0,
    icon: '🎩',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    code: 'LUX',
    name: 'Luxury',
    description: 'Premium luxury vehicles (Bentley, Rolls-Royce)',
    priceMultiplier: 2.5,
    icon: '💎',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    code: 'SUV',
    name: 'SUV',
    description: 'SUV vehicles (Range Rover, Audi Q7)',
    priceMultiplier: 1.5,
    icon: '🚙',
    isActive: true,
    order: 3,
  },
  {
    id: '4',
    code: 'VAN',
    name: 'Van',
    description: 'Large group transport (Mercedes Sprinter, Transit)',
    priceMultiplier: 1.8,
    icon: '🚐',
    isActive: true,
    order: 4,
  },
];

export function useSettingsVehicleCategories() {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories(mockCategories);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const updateCategory = (id: string, updates: Partial<VehicleCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const saveChanges = async () => {
    // TODO: Implement API call
    console.log('Saving categories:', categories);
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert('✅ Categories updated successfully!');
  };

  return {
    categories,
    loading,
    updateCategory,
    saveChanges,
  };
}
