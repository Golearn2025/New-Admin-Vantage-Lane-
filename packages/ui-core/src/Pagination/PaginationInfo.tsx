/**
 * PaginationInfo Component
 * Displays "Showing X-Y of Z items"
 */

import React from 'react';
import type { PaginationInfoProps } from './Pagination.types';
import styles from './Pagination.module.css';

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  size = 'medium',
  className = '',
}: PaginationInfoProps): React.ReactElement {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) {
    return <div className={`${styles.info} ${styles[size]} ${className}`}>No items</div>;
  }

  return (
    <div className={`${styles.info} ${styles[size]} ${className}`}>
      Showing <strong>{start}</strong>-<strong>{end}</strong> of <strong>{totalItems}</strong>
    </div>
  );
}
