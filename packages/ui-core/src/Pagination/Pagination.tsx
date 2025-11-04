/**
 * Pagination Component
 * Complete pagination with page numbers, navigation, and info
 */

import React, { useMemo } from 'react';
import { PaginationButton } from './PaginationButton';
import { PaginationInfo } from './PaginationInfo';
import type { PaginationProps } from './Pagination.types';
import styles from './Pagination.module.css';

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showInfo = true,
  showPrevNext = true,
  showFirstLast = false,
  maxPageButtons = 7,
  loading = false,
  disabled = false,
  size = 'medium',
  className = '',
}: PaginationProps): React.ReactElement {
  // Calculate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: Array<number | 'ellipsis'> = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Always show first page
      pages.push(1);

      if (shouldShowLeftEllipsis) {
        pages.push('ellipsis');
      }

      // Show current page and siblings
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (shouldShowRightEllipsis) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const isDisabled = disabled || loading;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isDisabled) {
      return;
    }
    onPageChange(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(event.target.value);
    onPageSizeChange?.(newPageSize);
  };

  if (totalPages === 0) {
    return (
      <div className={`${styles.pagination} ${styles[size]} ${className}`}>
        {showInfo && (
          <PaginationInfo currentPage={0} pageSize={pageSize} totalItems={0} size={size} />
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.pagination} ${styles[size]} ${className}`}>
      {/* Info text */}
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          size={size}
        />
      )}

      {/* Page buttons */}
      <div className={styles.buttons}>
        {/* First button */}
        {showFirstLast && (
          <PaginationButton
            page="first"
            currentPage={currentPage}
            disabled={isFirstPage || isDisabled}
            onClick={() => handlePageChange(1)}
            size={size}
          />
        )}

        {/* Previous button */}
        {showPrevNext && (
          <PaginationButton
            page="prev"
            currentPage={currentPage}
            disabled={isFirstPage || isDisabled}
            onClick={() => handlePageChange(currentPage - 1)}
            size={size}
          />
        )}

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <PaginationButton
            key={page === 'ellipsis' ? `ellipsis-${index}` : page}
            page={page}
            currentPage={currentPage}
            disabled={isDisabled}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            size={size}
          />
        ))}

        {/* Next button */}
        {showPrevNext && (
          <PaginationButton
            page="next"
            currentPage={currentPage}
            disabled={isLastPage || isDisabled}
            onClick={() => handlePageChange(currentPage + 1)}
            size={size}
          />
        )}

        {/* Last button */}
        {showFirstLast && (
          <PaginationButton
            page="last"
            currentPage={currentPage}
            disabled={isLastPage || isDisabled}
            onClick={() => handlePageChange(totalPages)}
            size={size}
          />
        )}
      </div>

      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className={styles.pageSizeSelector}>
          <label htmlFor="page-size" className={styles.label}>
            Rows per page:
          </label>
          <select
            id="page-size"
            className={styles.select}
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={isDisabled}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option === -1 ? 'All' : option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
