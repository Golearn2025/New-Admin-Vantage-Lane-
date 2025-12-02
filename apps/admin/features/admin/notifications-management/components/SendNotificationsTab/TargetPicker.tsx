/**
 * Target Picker Component
 * Allows selection of notification target audience
 * 
 * MODERN & PREMIUM - 100% ui-core + lucide-react
 */

'use client';

import { User, Car } from 'lucide-react';
import type { TargetType } from './types';
import React, { useMemo } from 'react';
import styles from './TargetPicker.module.css';

interface TargetPickerProps {
  selected: TargetType;
  onChange: (target: TargetType) => void;
}

interface TargetOption {
  value: TargetType;
  label: string;
  icon: React.ReactNode;
}

const TARGET_OPTIONS: TargetOption[] = [
  {
    value: 'all-admins',
    label: 'All Admins',
    icon: <User size={18} strokeWidth={2} />,
  },
  {
    value: 'all-operators',
    label: 'All Operators',
    icon: <User size={18} strokeWidth={2} />,
  },
  {
    value: 'all-drivers',
    label: 'All Drivers',
    icon: <Car size={18} strokeWidth={2} />,
  },
  {
    value: 'all-customers',
    label: 'All Customers',
    icon: <User size={18} strokeWidth={2} />,
  },
  {
    value: 'individual-driver',
    label: 'Specific Driver',
    icon: <User size={18} strokeWidth={2} />,
  },
  {
    value: 'individual-operator',
    label: 'Specific Operator',
    icon: <User size={18} strokeWidth={2} />,
  },
];

export function TargetPicker({ selected, onChange }: TargetPickerProps) {
  // Memoize target option buttons to prevent re-creation on every render
  const targetButtons = useMemo(() => 
    TARGET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.card} ${selected === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
          >
            <div className={styles.icon}>{option.icon}</div>
            <div className={styles.label}>{option.label}</div>
          </button>
        )), 
    [selected, onChange]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Target Audience</h3>
      <div className={styles.grid}>
        {targetButtons}
      </div>
    </div>
  );
}
