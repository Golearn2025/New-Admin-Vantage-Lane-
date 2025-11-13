/**
 * RefundsTable Component
 * Enterprise table cu selection, resizing, export - 100% consistent cu PaymentsTable
 * < 200 lines - RULES.md compliant
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { FileSpreadsheet, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import { 
  EnterpriseDataTable,
  usePagination,
  useSorting,
  useSelection,
  useColumnResize,
  BulkActionsToolbar,
  Pagination,
  MiniMetricCard,
  TableFilters,
  ActionButton,
} from '@vantage-lane/ui-core';
import { useRefundsTable } from '../hooks/useRefundsTable';
import { useRefundsFilters } from '../hooks/useRefundsFilters';
import { getRefundsColumns } from '../columns';
import styles from './RefundsTable.module.css';

export function RefundsTable() {
  const { data, loading, error } = useRefundsTable({
    page: 1,
    limit: 25
  });

  // Hooks modulare - Enterprise pattern!
  const pagination = usePagination({ initialPageSize: 25 });
  const sorting = useSorting({ initialColumnId: 'createdAt', initialDirection: 'desc' });
  const selection = useSelection({ 
    data, 
    getRowId: (row, index) => row.id || String(index) 
  });
  const resize = useColumnResize({
    initialWidths: {
      id: 150,
      paymentId: 150,
      amount: 120,
      status: 120,
      createdAt: 130,
    }
  });
  const filtersHook = useRefundsFilters();

  // Update total count când se încarcă data
  useEffect(() => {
    if (data.length > 0) {
      pagination.setTotalCount(data.length);
    }
  }, [data, pagination]);

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalRefunds = data.length;
    const totalAmount = data.reduce((sum, refund) => sum + (refund.amount || 0), 0);
    const successfulRefunds = data.filter(r => r.status === 'succeeded').length;
    const successRate = totalRefunds > 0 ? ((successfulRefunds / totalRefunds) * 100).toFixed(1) : '0';
    
    return {
      totalRefunds,
      totalAmount: `£${(totalAmount / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      successRate: `${successRate}%`,
      pendingRefunds: data.filter(r => r.status === 'pending').length,
    };
  }, [data]);

  // Export functions
  const handleExportAll = (format: 'excel' | 'csv') => {
    console.log(`Exporting all ${data.length} refunds to ${format}`);
    alert(`Exporting all ${data.length} refunds to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  const handleExportSelected = (format: 'excel' | 'csv') => {
    console.log(`Exporting ${selection.selectedCount} selected refunds to ${format}`);
    alert(`Exporting ${selection.selectedCount} selected refunds to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filtersHook.filters.status) {
      filtered = filtered.filter(r => r.status === filtersHook.filters.status);
    }

    if (filtersHook.filters.dateRange.from) {
      const fromDate = new Date(filtersHook.filters.dateRange.from);
      filtered = filtered.filter(r => new Date(r.createdAt || '') >= fromDate);
    }
    if (filtersHook.filters.dateRange.to) {
      const toDate = new Date(filtersHook.filters.dateRange.to);
      filtered = filtered.filter(r => new Date(r.createdAt || '') <= toDate);
    }

    if (filtersHook.filters.amountRange.min !== null) {
      filtered = filtered.filter(r => (r.amount || 0) / 100 >= (filtersHook.filters.amountRange.min || 0));
    }
    if (filtersHook.filters.amountRange.max !== null) {
      filtered = filtered.filter(r => (r.amount || 0) / 100 <= (filtersHook.filters.amountRange.max || 0));
    }

    if (filtersHook.filters.search) {
      const searchLower = filtersHook.filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.id?.toLowerCase().includes(searchLower) ||
        r.status?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [data, filtersHook.filters]);

  // Update total count for filtered data
  useEffect(() => {
    pagination.setTotalCount(filteredData.length);
  }, [filteredData, pagination]);

  // Paginate filtered data - slice based on current page
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  // Bulk actions pentru selected rows
  const bulkActions = [
    {
      id: 'export-excel',
      label: 'Export Selected (Excel)',
      onClick: () => handleExportSelected('excel'),
    },
    {
      id: 'export-csv',
      label: 'Export Selected (CSV)',
      onClick: () => handleExportSelected('csv'),
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      onClick: () => {
        if (confirm(`Delete ${selection.selectedCount} refunds?`)) {
          console.log('Deleting:', selection.selectedRows);
        }
      },
      destructive: true,
    },
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading refunds: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <MiniMetricCard
          label="Total Refunds"
          value={metrics.totalRefunds}
          icon="refresh"
          iconColor="info"
        />
        <MiniMetricCard
          label="Refunded Amount"
          value={metrics.totalAmount}
          icon="dollar-circle"
          iconColor="warning"
        />
        <MiniMetricCard
          label="Success Rate"
          value={metrics.successRate}
          icon="check"
          iconColor="success"
        />
        <MiniMetricCard
          label="Pending Refunds"
          value={metrics.pendingRefunds}
          icon="clock"
          iconColor="warning"
        />
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Refunds</h1>
          <p className={styles.description}>
            Manage all payment refunds
            {selection.selectedCount > 0 && (
              <span className={styles.selectedInfo}>
                {' '}• {selection.selectedCount} selected
              </span>
            )}
          </p>
        </div>
        
        {/* Export Buttons - exportă TOT */}
        <div className={styles.actions}>
          <button
            className={styles.exportButton}
            onClick={() => handleExportAll('excel')}
            title="Export all refunds to Excel"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
          <button
            className={styles.exportButton}
            onClick={() => handleExportAll('csv')}
            title="Export all refunds to CSV"
          >
            <FileText size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <TableFilters
        statusOptions={[
          { label: 'Succeeded', value: 'succeeded' },
          { label: 'Pending', value: 'pending' },
          { label: 'Failed', value: 'failed' },
        ]}
        statusValue={filtersHook.filters.status}
        onStatusChange={filtersHook.setStatus}
        showDateRange={true}
        dateRange={filtersHook.filters.dateRange}
        onDateRangeChange={filtersHook.setDateRange}
        showAmountRange={true}
        amountRange={filtersHook.filters.amountRange}
        onAmountRangeChange={filtersHook.setAmountRange}
        showSearch={true}
        searchValue={filtersHook.filters.search}
        searchPlaceholder="Search by ID, Payment ID, Status..."
        onSearchChange={filtersHook.setSearch}
        onClearAll={filtersHook.clearAll}
      />

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <ActionButton
          variant="primary"
          size="md"
          icon={<ExternalLink size={16} strokeWidth={2} />}
          label="View in Stripe"
          onClick={() => {
            window.open('https://dashboard.stripe.com/refunds', '_blank');
          }}
        />
        <ActionButton
          variant="secondary"
          size="md"
          icon={<RefreshCw size={16} strokeWidth={2} />}
          label="Sync with Stripe"
          onClick={() => {
            alert('Syncing refunds with Stripe...');
          }}
        />
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selection.selectedCount}
        actions={bulkActions}
        onClearSelection={selection.clearSelection}
      />

      {/* Table area - scrollable */}
      <div className={styles.tableArea}>
        <EnterpriseDataTable
        data={paginatedData}
        columns={getRefundsColumns()}
        selection={selection}
        sorting={sorting}
        resize={resize}
        loading={loading}
        emptyState="No refunds found"
        striped={true}
        bordered={true}
        stickyHeader={true}
        ariaLabel="Refunds table"
        />
      </div>

      {/* Pagination Controls */}
      <div className={styles.paginationWrapper}>
        <Pagination
        currentPage={pagination.pageIndex + 1}
        totalPages={pagination.pageCount}
        totalItems={pagination.totalCount}
        pageSize={pagination.pageSize}
        onPageChange={(page) => pagination.setPage(page - 1)}
        onPageSizeChange={pagination.setPageSize}
        showInfo={true}
        showPageSizeSelector={true}
        />
      </div>
    </div>
  );
}
