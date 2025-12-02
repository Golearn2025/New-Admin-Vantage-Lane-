/**
 * UsersTableHeader Component
 * 
 * Header section with title, count, search, and action buttons - focused on header functionality
 */

'use client';

import React from 'react';
import { Input, TableActions } from '@vantage-lane/ui-core';
import styles from './UsersTableBase.module.css';

interface UsersTableHeaderProps {
  title: string;
  userType: string;
  filteredCount: number;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showCreateButton: boolean;
  createLabel: string;
  onCreateClick: () => void;
  onRefresh: () => void;
}

export function UsersTableHeader({
  title,
  userType,
  filteredCount,
  loading,
  searchQuery,
  onSearchChange,
  showCreateButton,
  createLabel,
  onCreateClick,
  onRefresh
}: UsersTableHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.count}>
          {loading
            ? '...'
            : `${filteredCount} ${userType === 'all' ? 'users' : `${userType}s`}`}
        </span>
      </div>

      <div className={styles.headerRight}>
        <Input
          type="search"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="md"
        />

        {showCreateButton && (
          <TableActions
            onAdd={onCreateClick}
            onRefresh={onRefresh}
            loading={loading}
            addLabel={createLabel}
            showExport={false}
          />
        )}
        {!showCreateButton && (
          <TableActions onRefresh={onRefresh} loading={loading} showExport={false} />
        )}
      </div>
    </div>
  );
}
