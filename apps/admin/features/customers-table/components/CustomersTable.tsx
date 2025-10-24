/**
 * CustomersTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import styles from './CustomersTable.module.css';

export interface CustomersTableProps {
  className?: string;
}

export function CustomersTable({ className }: CustomersTableProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CustomersTable</h1>
      {/* Add your content here */}
    </div>
  );
}
