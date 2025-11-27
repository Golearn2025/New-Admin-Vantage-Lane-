/**
 * UsersTableFilters Component - PERFORMANCE OPTIMIZED
 * 
 * Search input and filter controls for users table
 * Memoized to prevent unnecessary re-renders
 */

'use client';

import React, { memo } from 'react';
import { Input, TableActions, Button } from '@vantage-lane/ui-core';
import { BulkActionsBar } from './BulkActionsBar';
import type { UnifiedUser } from '@entities/user';
import styles from './UsersTableBase.module.css';

interface UsersTableFiltersProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showCreateButton: boolean;
  createLabel: string;
  onCreateClick: () => void;
  selectedCount: number;
  selectedUserIds: string[];
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
  isProcessing: boolean;
}

const UsersTableFiltersComponent = ({
  title,
  searchQuery,
  onSearchChange,
  showCreateButton,
  createLabel,
  onCreateClick,
  selectedCount,
  selectedUserIds,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  isProcessing,
}: UsersTableFiltersProps) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users..."
            className={styles.searchInput}
          />
        </div>
        
        <TableActions>
          {showCreateButton && (
            <Button
              variant="primary"
              onClick={onCreateClick}
              disabled={isProcessing}
            >
              {createLabel}
            </Button>
          )}
        </TableActions>
      </div>
      
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          selectedUserIds={selectedUserIds}
          onActivate={onBulkActivate}
          onDeactivate={onBulkDeactivate}
          onDelete={onBulkDelete}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const UsersTableFilters = memo(UsersTableFiltersComponent);
