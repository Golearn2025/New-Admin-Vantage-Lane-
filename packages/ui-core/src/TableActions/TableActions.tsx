/**
 * TableActions Component
 * 
 * Action buttons pentru header-ul tabelelor (Add/Export/Refresh)
 * Premium UI cu gradients și animații
 */

import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './TableActions.module.css';

export interface TableActionsProps {
  /** Handler pentru Add button */
  onAdd?: () => void;
  /** Handler pentru Export button */
  onExport?: () => void;
  /** Handler pentru Refresh button */
  onRefresh?: () => void;
  /** Loading state pentru Refresh */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Label pentru Add button */
  addLabel?: string;
  /** Hide specific buttons */
  showAdd?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  /** Custom class */
  className?: string;
}

export function TableActions({
  onAdd,
  onExport,
  onRefresh,
  loading = false,
  disabled = false,
  addLabel = 'Add New',
  showAdd = true,
  showExport = true,
  showRefresh = true,
  className = '',
}: TableActionsProps) {
  return (
    <div className={`${styles.actions} ${className}`}>
      {showAdd && onAdd && (
        <Button
          variant="primary"
          size="md"
          onClick={onAdd}
          disabled={disabled}
          leftIcon={<Icon name="plus" size="sm" />}
        >
          {addLabel}
        </Button>
      )}

      {showExport && onExport && (
        <Button
          variant="secondary"
          size="md"
          onClick={onExport}
          disabled={disabled || loading}
          leftIcon={<Icon name="download" size="sm" />}
        >
          Export
        </Button>
      )}

      {showRefresh && onRefresh && (
        <button
          type="button"
          className={`${styles.refreshButton} ${loading ? styles.loading : ''}`}
          onClick={onRefresh}
          disabled={disabled}
          aria-label="Refresh data"
        >
          <Icon name="refresh" size="sm" />
        </button>
      )}
    </div>
  );
}
