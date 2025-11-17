/**
 * Reviews Tab Component
 * 
 * Dedicated tab pentru driver reviews cu filters, table și pagination.
 * Single responsibility - < 200 linii conform RULES.md
 */

'use client';

import React, { useState } from 'react';
import { 
  EnterpriseDataTable,
  TableFilters,
  Pagination,
  Button
} from '@vantage-lane/ui-core';
import { useDriverReviews } from '../hooks/useDriverReviews';
import { driverReviewColumns } from '../columns/reviewColumns';
import type { DriverReview } from '@entities/review';
import styles from './ReviewsTab.module.css';

export interface ReviewsTabProps {
  onReviewClick: (review: DriverReview) => void;
}

export function ReviewsTab({ onReviewClick }: ReviewsTabProps) {
  // Reviews filters state
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    status: '',
    page: 1,
    pageSize: 25
  });

  // Driver reviews data with filters
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    total: reviewsTotal,
    totalPages: reviewsTotalPages,
    page: reviewsCurrentPage,
    refetch: refetchReviews
  } = useDriverReviews({
    page: filters.page,
    limit: filters.pageSize,
    ...(filters.rating && { rating: parseInt(filters.rating) }),
    ...(filters.status === 'verified' && { isVerified: true }),
    ...(filters.status === 'unverified' && { isVerified: false })
  });

  // Filter handlers
  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to page 1 when filtering
    }));
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      rating: '',
      status: '',
      page: 1,
      pageSize: 25
    });
  };

  return (
    <div className={styles.reviewsTab}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Driver Reviews</h3>
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchReviews}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        showSearch={true}
        searchPlaceholder="Search drivers or customers..."
        searchValue={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        
        statusOptions={[
          { value: '', label: 'All Reviews' },
          { value: 'verified', label: 'Verified' },
          { value: 'unverified', label: 'Unverified' },
          { value: '5', label: '5 Stars' },
          { value: '4', label: '4 Stars' },
          { value: '3', label: '3 Stars' },
          { value: '2', label: '2 Stars' },
          { value: '1', label: '1 Star' }
        ]}
        statusValue={filters.rating || filters.status}
        onStatusChange={(value) => {
          if (['1', '2', '3', '4', '5'].includes(value)) {
            handleFilterChange('rating', value);
            handleFilterChange('status', '');
          } else {
            handleFilterChange('status', value);
            handleFilterChange('rating', '');
          }
        }}
        
        showDateRange={true}
        onClearAll={handleClearFilters}
      />
      
      {/* Content */}
      {reviewsError ? (
        <div className={styles.error}>
          Error: {reviewsError}
        </div>
      ) : (
        <>
          <EnterpriseDataTable
            data={reviews}
            columns={driverReviewColumns}
            loading={reviewsLoading}
            stickyHeader={true}
            onRowClick={onReviewClick}
          />
          
          <Pagination
            currentPage={reviewsCurrentPage}
            totalPages={reviewsTotalPages}
            totalItems={reviewsTotal}
            pageSize={filters.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            showInfo={true}
          />
        </>
      )}
    </div>
  );
}

ReviewsTab.displayName = 'ReviewsTab';
