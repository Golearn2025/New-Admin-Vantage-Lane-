/**
 * BulkActionsToolbar Component
 * Toolbar for bulk actions on selected rows
 * Enterprise pattern - 100% reusable
 */

import React from 'react';
import styles from './BulkActionsToolbar.module.css';

export interface BulkAction {
  /** Action ID */
  id: string;
  /** Action label */
  label: string;
  /** Action icon (optional) */
  icon?: React.ReactNode;
  /** Action handler */
  onClick: () => void;
  /** Is action destructive? (red color) */
  destructive?: boolean;
  /** Is action disabled? */
  disabled?: boolean;
}

export interface BulkActionsToolbarProps {
  /** Number of selected rows */
  selectedCount: number;
  /** Bulk actions */
  actions: BulkAction[];
  /** Clear selection handler */
  onClearSelection: () => void;
  /** Custom className */
  className?: string;
}

export function BulkActionsToolbar({
  selectedCount,
  actions,
  onClearSelection,
  className,
}: BulkActionsToolbarProps): React.ReactElement | null {
  if (selectedCount === 0) return null;

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.info}>
        <span className={styles.count}>
          {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          className={styles.clearButton}
        >
          Clear selection
        </button>
      </div>

      <div className={styles.actions}>
        {actions.map((action) => {
          const buttonClasses = [
            styles.actionButton,
            action.destructive && styles.destructive,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={buttonClasses}
            >
              {action.icon && (
                <span className={styles.icon}>{action.icon}</span>
              )}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
