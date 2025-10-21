/**
 * PaginationButton Component
 * Button for page numbers and navigation
 */

import React from 'react';
import type { PaginationButtonProps } from './Pagination.types';
import styles from './Pagination.module.css';

export function PaginationButton({
  page,
  currentPage,
  disabled = false,
  onClick,
  size = 'medium',
  className = '',
}: PaginationButtonProps): React.ReactElement {
  const isActive = typeof page === 'number' && page === currentPage;
  const isEllipsis = page === 'ellipsis';

  const getButtonContent = () => {
    if (typeof page === 'number') {
      return page;
    }

    switch (page) {
      case 'prev':
        return '‹';
      case 'next':
        return '›';
      case 'first':
        return '«';
      case 'last':
        return '»';
      case 'ellipsis':
        return '...';
      default:
        return page;
    }
  };

  const getAriaLabel = () => {
    if (typeof page === 'number') {
      return `Page ${page}`;
    }

    switch (page) {
      case 'prev':
        return 'Previous page';
      case 'next':
        return 'Next page';
      case 'first':
        return 'First page';
      case 'last':
        return 'Last page';
      default:
        return undefined;
    }
  };

  if (isEllipsis) {
    return (
      <span
        className={`${styles.button} ${styles.ellipsis} ${styles[size]} ${className}`}
        aria-hidden="true"
      >
        {getButtonContent()}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`
        ${styles.button}
        ${styles[size]}
        ${isActive ? styles.active : ''}
        ${disabled ? styles.disabled : ''}
        ${className}
      `.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={getAriaLabel()}
      aria-current={isActive ? 'page' : undefined}
    >
      {getButtonContent()}
    </button>
  );
}
