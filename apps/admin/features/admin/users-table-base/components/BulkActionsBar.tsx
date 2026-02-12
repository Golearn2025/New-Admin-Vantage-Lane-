/**
 * BulkActionsBar Component
 * 
 * Displays bulk action buttons when users are selected
 * Compliant: <100 lines, TypeScript strict, zero inline functions
 */

'use client';

import { Button } from '@vantage-lane/ui-core';
import styles from './BulkActionsBar.module.css';

export interface BulkActionsBarProps {
  selectedCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onSetOnline?: () => void;
  onSetOffline?: () => void;
  showOnlineOffline?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onActivate,
  onDeactivate,
  onDelete,
  onSetOnline,
  onSetOffline,
  showOnlineOffline = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkActions}>
      <span className={styles.selectedCount}>
        {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className={styles.bulkButtons}>
        {showOnlineOffline && onSetOnline && (
          <Button onClick={onSetOnline} variant="primary" size="sm">
            🟢 Set Online
          </Button>
        )}
        {showOnlineOffline && onSetOffline && (
          <Button onClick={onSetOffline} variant="secondary" size="sm">
            🔴 Set Offline
          </Button>
        )}
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
