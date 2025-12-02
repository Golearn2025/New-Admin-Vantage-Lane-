/**
 * Safety Incidents Tab Component
 * 
 * Dedicated tab pentru safety incidents cu filters și investigation.
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
import { useSafetyIncidents } from '../hooks/useSafetyIncidents';
import { safetyIncidentColumns } from '../columns/reviewColumns';
import type { SafetyIncident } from '@entities/review';
import styles from './SafetyIncidentsTab.module.css';

export interface SafetyIncidentsTabProps {
  onIncidentClick: (incident: SafetyIncident) => void;
}

export function SafetyIncidentsTab({ onIncidentClick }: SafetyIncidentsTabProps) {
  // Safety incidents filters state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    severity: '',
    page: 1,
    pageSize: 25
  });

  // Safety incidents data with filters
  const {
    incidents,
    loading: incidentsLoading,
    error: incidentsError,
    total: incidentsTotal,
    totalPages: incidentsTotalPages,
    page: incidentsCurrentPage,
    refetch: refetchIncidents,
    updateIncidentStatus
  } = useSafetyIncidents({
    page: filters.page,
    limit: filters.pageSize,
    ...(filters.status && { status: filters.status as 'pending' | 'investigating' | 'resolved' | 'dismissed' }),
    ...(filters.severity && { severity: parseInt(filters.severity) as 1 | 2 | 3 | 4 })
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
      status: '',
      severity: '',
      page: 1,
      pageSize: 25
    });
  };

  return (
    <div className={styles.incidentsTab}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Safety Incidents</h3>
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchIncidents}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        showSearch={true}
        searchPlaceholder="Search incidents..."
        searchValue={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        
        statusOptions={[
          { value: '', label: 'All Incidents' },
          { value: 'pending', label: 'Pending Review' },
          { value: 'investigating', label: 'Under Investigation' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'dismissed', label: 'Dismissed' },
          { value: '4', label: 'Critical Severity' },
          { value: '3', label: 'High Severity' },
          { value: '2', label: 'Medium Severity' },
          { value: '1', label: 'Low Severity' }
        ]}
        statusValue={filters.severity || filters.status}
        onStatusChange={(value) => {
          if (['1', '2', '3', '4'].includes(value)) {
            handleFilterChange('severity', value);
            handleFilterChange('status', '');
          } else {
            handleFilterChange('status', value);
            handleFilterChange('severity', '');
          }
        }}
        
        showDateRange={true}
        onClearAll={handleClearFilters}
      />
      
      {/* Content */}
      {incidentsError ? (
        <div className={styles.error}>
          Error: {incidentsError}
        </div>
      ) : (
        <>
          <EnterpriseDataTable
            data={incidents}
            columns={safetyIncidentColumns}
            loading={incidentsLoading}
            stickyHeader={true}
            onRowClick={onIncidentClick}
          />
          
          <Pagination
            currentPage={incidentsCurrentPage}
            totalPages={incidentsTotalPages}
            totalItems={incidentsTotal}
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

SafetyIncidentsTab.displayName = 'SafetyIncidentsTab';
