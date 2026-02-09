/**
 * DisputesTable Component - Refactored Orchestrator
 * 
 * Orchestrates smaller focused components - RULES.md compliant
 * Split 317 → 175 lines (-45%)
 */

'use client';

import {
    BulkActionsToolbar,
    Pagination,
    TableFilters,
    TanStackDataTable,
    toTanStackColumns,
    useSelection,
} from '@vantage-lane/ui-core';
import { useEffect, useMemo, useState } from 'react';
import { getDisputesColumns } from '../columns';
import { useDisputesFilters } from '../hooks/useDisputesFilters';
import { useDisputesTable } from '../hooks/useDisputesTable';
import { createDisputesBulkActions } from '../utils/disputesBulkActions';
import { DisputesActionButtons } from './DisputesActionButtons';
import { DisputesExportActions } from './DisputesExportActions';
import { DisputesMetrics } from './DisputesMetrics';
import styles from './DisputesTable.module.css';

export function DisputesTable() {
  const { data, loading, error } = useDisputesTable({
    page: 1,
    limit: 25
  });

  const selection = useSelection({ 
    data, 
    getRowId: (row, index) => row.id || String(index) 
  });
  const filtersHook = useDisputesFilters();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
    totalCount: 0,
  });

  // Export functions
  const handleExportAll = (format: 'excel' | 'csv') => {
    alert(`Exporting all ${data.length} disputes to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  const handleExportSelected = (format: 'excel' | 'csv') => {
    alert(`Exporting ${selection.selectedCount} selected disputes to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  // Action handlers
  const handleViewInStripe = () => {
    window.open('https://dashboard.stripe.com/disputes', '_blank');
  };

  const handleSyncWithStripe = () => {
    alert('Syncing disputes with Stripe...');
  };

  const handleSubmitEvidence = () => {
    alert(`Submit evidence for ${selection.selectedCount} selected disputes`);
    // TODO: Implement evidence upload
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selection.selectedCount} disputes?`)) {
      // TODO: Implement delete functionality
    }
  };

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filtersHook.filters.status) {
      filtered = filtered.filter(d => d.status === filtersHook.filters.status);
    }

    if (filtersHook.filters.dateRange.from) {
      const fromDate = new Date(filtersHook.filters.dateRange.from);
      filtered = filtered.filter(d => new Date(d.createdAt || '') >= fromDate);
    }
    if (filtersHook.filters.dateRange.to) {
      const toDate = new Date(filtersHook.filters.dateRange.to);
      filtered = filtered.filter(d => new Date(d.createdAt || '') <= toDate);
    }

    if (filtersHook.filters.search) {
      const searchLower = filtersHook.filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.id?.toLowerCase().includes(searchLower) ||
        d.status?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [data, filtersHook.filters]);

  // Update total count for filtered data
  useEffect(() => {
    setPagination((p) => {
      if (p.totalCount === filteredData.length) return p;
      return { ...p, totalCount: filteredData.length };
    });
  }, [filteredData]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  // Convert columns to TanStack format
  const tanStackColumns = useMemo(() => toTanStackColumns(getDisputesColumns()), []);
  const totalPages = Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize));

  // Bulk actions configuration
  const bulkActions = createDisputesBulkActions(selection.selectedCount, {
    handleExportSelected,
    handleDeleteSelected,
  });

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading disputes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Metric Cards */}
      <DisputesMetrics data={data} />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Disputes</h1>
          <p className={styles.description}>
            Manage payment disputes and submit evidence
            {selection.selectedCount > 0 && (
              <span className={styles.selectedInfo}>
                {' '}• {selection.selectedCount} selected
              </span>
            )}
          </p>
        </div>
        
        {/* Export Buttons - exportă TOT */}
        <DisputesExportActions
          totalCount={data.length}
          onExportExcel={() => handleExportAll('excel')}
          onExportCsv={() => handleExportAll('csv')}
        />
      </div>

      {/* Filters Section */}
      <TableFilters
        statusOptions={[
          { label: 'Open', value: 'open' },
          { label: 'Won', value: 'won' },
          { label: 'Lost', value: 'lost' },
          { label: 'Under Review', value: 'under_review' },
        ]}
        statusValue={filtersHook.filters.status}
        onStatusChange={filtersHook.setStatus}
        showDateRange={true}
        dateRange={filtersHook.filters.dateRange}
        onDateRangeChange={filtersHook.setDateRange}
        showSearch={true}
        searchValue={filtersHook.filters.search}
        searchPlaceholder="Search by ID, Status..."
        onSearchChange={filtersHook.setSearch}
        onClearAll={filtersHook.clearAll}
      />

      {/* Action Buttons */}
      <DisputesActionButtons
        selectedCount={selection.selectedCount}
        onViewInStripe={handleViewInStripe}
        onSyncWithStripe={handleSyncWithStripe}
        onSubmitEvidence={handleSubmitEvidence}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selection.selectedCount}
        actions={bulkActions}
        onClearSelection={selection.clearSelection}
      />

      {/* Table area - scrollable */}
      <div className={styles.tableArea}>
        <TanStackDataTable
          data={paginatedData}
          columns={tanStackColumns}
          getRowId={(row) => row.id || ''}
          loading={loading}
          emptyState="No disputes found"
          striped={true}
          enableResize={true}
          stickyHeader={true}
          ariaLabel="Disputes table"
        />
      </div>

      {/* Pagination Controls */}
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalPages={totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((p) => ({ ...p, pageIndex: page - 1 }))}
          onPageSizeChange={(size) => setPagination((p) => ({ pageIndex: 0, pageSize: size, totalCount: p.totalCount }))}
          showInfo={true}
          showPageSizeSelector={true}
        />
      </div>
    </div>
  );
}
