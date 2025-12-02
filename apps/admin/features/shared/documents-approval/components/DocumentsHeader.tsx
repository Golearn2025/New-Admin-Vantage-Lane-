/**
 * DocumentsHeader Component
 * 
 * Header section with title, search, and table actions
 * 
 * ✅ Zero any types
 * ✅ Design tokens only
 * ✅ UI-core components
 * ✅ Lucide-react icons
 */

import { Input, TableActions } from '@vantage-lane/ui-core';
import styles from './DocumentsApprovalTable.module.css';

interface DocumentsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function DocumentsHeader({
  searchValue,
  onSearchChange,
  onExport,
  onRefresh,
  loading,
}: DocumentsHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>Documents Approval</h1>
        <span className={styles.subtitle}>Review and approve driver & operator documents</span>
      </div>

      <div className={styles.headerRight}>
        <Input
          type="search"
          placeholder="Search by name, email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          size="md"
        />

        <TableActions
          onExport={onExport}
          onRefresh={onRefresh}
          loading={loading}
          showAdd={false}
        />
      </div>
    </div>
  );
}
