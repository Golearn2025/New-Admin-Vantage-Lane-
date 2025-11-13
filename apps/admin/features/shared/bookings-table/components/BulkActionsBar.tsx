'use client';

import { Button } from '@vantage-lane/ui-core';
import { Check, UserCheck, X, Trash2 } from 'lucide-react';
import styles from './BookingsTable.module.css';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedCount, onClearSelection }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkActionsBar}>
      <div className={styles.bulkActionsContent}>
        <span className={styles.selectedCount}>
          <Check size={16} /> {selectedCount} selected
        </span>
        <div className={styles.bulkActions}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<UserCheck size={16} />}
            onClick={() => console.log('Assign selected')}
          >
            Assign
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<X size={16} />}
            onClick={() => console.log('Cancel selected')}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={() => console.log('Delete selected')}
          >
            Delete
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          aria-label="Clear selection"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
