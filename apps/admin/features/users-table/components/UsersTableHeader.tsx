'use client';

/**
 * Users Table Header
 * Search bar + Action buttons
 */

import { TableActions, Input } from '@vantage-lane/ui-core';
import styles from './UsersTable.module.css';

interface UsersTableHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdd: () => void;
  onExport: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function UsersTableHeader({
  searchQuery,
  onSearchChange,
  onAdd,
  onExport,
  onRefresh,
  loading = false,
}: UsersTableHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.searchSection}>
        <Input
          type="search"
          placeholder="Search users by name, email, role..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <TableActions
        onAdd={onAdd}
        onExport={onExport}
        onRefresh={onRefresh}
        loading={loading}
        addLabel="Add User"
      />
    </div>
  );
}
