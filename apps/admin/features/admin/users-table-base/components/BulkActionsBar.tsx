/**
 * BulkActionsBar Component
 * 
 * Displays bulk action buttons when users are selected
 * Compliant: <100 lines, TypeScript strict, zero inline functions
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import styles from './BulkActionsBar.module.css';

export interface BulkActionsBarProps {
  selectedCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onActivate,
  onDeactivate,
  onDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkActions}>
      <span className={styles.selectedCount}>
        {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className={styles.bulkButtons}>
        <Button onClick={onActivate} variant="secondary" size="sm">
          Activate
        </Button>
        <Button onClick={onDeactivate} variant="secondary" size="sm">
          Deactivate
        </Button>
        <Button onClick={onDelete} variant="danger" size="sm">
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
