/**
 * User Selector Component
 * Dropdown for selecting individual user
 * 
 * MODERN & PREMIUM - 100% ui-core
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { Select } from '@vantage-lane/ui-core';
import type { UserOption, TargetType, SelectOption } from './types';
import styles from './UserSelector.module.css';

interface UserSelectorProps {
  target: TargetType;
  value: string;
  onChange: (userId: string) => void;
  users: UserOption[];
  loading: boolean;
}

export function UserSelector({
  target,
  value,
  onChange,
  users,
  loading,
}: UserSelectorProps) {
  if (target !== 'individual-driver' && target !== 'individual-operator') {
    return null;
  }

  const label = target === 'individual-driver' ? 'Driver' : 'Operator';
  
  // Memoize user options to prevent re-creation on every render
  const options: SelectOption[] = useMemo(() => [
    { value: '', label: '-- Select --' },
    ...users.map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ], [users]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Select {label}</h3>
      {loading ? (
        <div className={styles.loading}>Loading users...</div>
      ) : (
        <Select
          value={value}
          options={options}
          onChange={(val) => onChange(String(val))}
          placeholder={`-- Select ${label} --`}
        />
      )}
    </div>
  );
}
