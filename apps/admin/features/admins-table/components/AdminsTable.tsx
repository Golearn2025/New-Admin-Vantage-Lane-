/**
 * AdminsTable Component
 * 
 * 100% design tokens, zero hardcoded values
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import styles from './AdminsTable.module.css';

export interface AdminsTableProps {
  className?: string;
}

export function AdminsTable({ className }: AdminsTableProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AdminsTable</h1>
      {/* Add your content here */}
    </div>
  );
}
