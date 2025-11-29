'use client';

/**
 * Payments Table Component
 * Enterprise table cu TOATE features: pagination, sorting, selection, resizing
 */

import React, { useEffect, useMemo } from 'react';
import { FileSpreadsheet, FileText, ExternalLink, RefreshCw, Ban } from 'lucide-react';
import { formatCurrency, formatDate, formatPercentage } from '@/shared/utils/formatters';
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
import type { Payment, PaymentTableRow } from '../types';
import { usePaymentsList } from '../hooks/usePaymentsList';
import { usePaymentsFilters } from '../hooks/usePaymentsFilters';
import styles from './PaymentsTable.module.css';

export function PaymentsTable() {
  const { data, loading, error } = usePaymentsList();

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
      bookingId: 150,
      amount: 120,
      status: 120,
      createdAt: 130,
    }
  });
  const filtersHook = usePaymentsFilters();

  // Update total count când se încarcă data
  useEffect(() => {
    if (data.length > 0) {
      pagination.setTotalCount(data.length);
    }
  }, [data, pagination]);

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalTransactions = data.length;
    const totalAmount = data.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const successfulPayments = data.filter(p => p.status === 'captured' || p.status === 'authorized').length;
    const successRate = totalTransactions > 0 ? formatPercentage((successfulPayments / totalTransactions) * 100, 1) : formatPercentage(0, 1);
    
    return {
      totalTransactions,
      totalAmount: `£${(totalAmount / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      successRate: `${successRate}%`,
      successCount: successfulPayments,
    };
  }, [data]);

  // Export functions
  const handleExportAll = (format: 'excel' | 'csv') => {
    console.log(`Exporting all ${data.length} payments to ${format}`);
    alert(`Exporting all ${data.length} payments to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  const handleExportSelected = (format: 'excel' | 'csv') => {
    console.log(`Exporting ${selection.selectedCount} selected payments to ${format}`);
    alert(`Exporting ${selection.selectedCount} selected payments to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Status filter
    if (filtersHook.filters.status) {
      filtered = filtered.filter(p => p.status === filtersHook.filters.status);
    }

    // Date range filter
    if (filtersHook.filters.dateRange.from) {
      const fromDate = new Date(filtersHook.filters.dateRange.from);
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt || '');
        return paymentDate >= fromDate;
      });
    }
    if (filtersHook.filters.dateRange.to) {
      const toDate = new Date(filtersHook.filters.dateRange.to);
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt || '');
        return paymentDate <= toDate;
      });
    }

    // Amount range filter
    if (filtersHook.filters.amountRange.min !== null) {
      filtered = filtered.filter(p => (p.amount || 0) / 100 >= (filtersHook.filters.amountRange.min || 0));
    }
    if (filtersHook.filters.amountRange.max !== null) {
      filtered = filtered.filter(p => (p.amount || 0) / 100 <= (filtersHook.filters.amountRange.max || 0));
    }

    // Search filter
    if (filtersHook.filters.search) {
      const searchLower = filtersHook.filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.id?.toLowerCase().includes(searchLower) ||
        p.bookingId?.toLowerCase().includes(searchLower) ||
        p.status?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [data, filtersHook.filters]);

  // Update total count for filtered data
  useEffect(() => {
    pagination.setTotalCount(filteredData.length);
  }, [filteredData, pagination]);

  // Bulk actions pentru selected rows
  // Paginate filtered data - slice based on current page
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

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
        if (confirm(`Delete ${selection.selectedCount} payments?`)) {
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
          Error loading payments: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <MiniMetricCard
          label="Total Transactions"
          value={metrics.totalTransactions}
          icon="shopping-cart"
          iconColor="info"
        />
        <MiniMetricCard
          label="Total Amount"
          value={metrics.totalAmount}
          icon="dollar-circle"
          iconColor="success"
        />
        <MiniMetricCard
          label="Success Rate"
          value={metrics.successRate}
          icon="check"
          iconColor="success"
        />
        <MiniMetricCard
          label="Successful Payments"
          value={metrics.successCount}
          icon="trending-up"
          iconColor="theme"
        />
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payment Transactions</h1>
          <p className={styles.description}>
            All payment transactions from bookings
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
            title="Export all payments to Excel"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
          <button
            className={styles.exportButton}
            onClick={() => handleExportAll('csv')}
            title="Export all payments to CSV"
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
          { label: 'Captured', value: 'captured' },
          { label: 'Authorized', value: 'authorized' },
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
        searchPlaceholder="Search by ID, Booking ID, Status..."
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
            const stripeUrl = 'https://dashboard.stripe.com/payments';
            window.open(stripeUrl, '_blank');
          }}
        />
        <ActionButton
          variant="secondary"
          size="md"
          icon={<RefreshCw size={16} strokeWidth={2} />}
          label="Sync with Stripe"
          onClick={() => {
            alert('Syncing with Stripe...');
            // TODO: Implement Stripe sync
          }}
        />
        <ActionButton
          variant="secondary"
          size="md"
          icon={<Ban size={16} strokeWidth={2} />}
          label="Refund Selected"
          disabled={selection.selectedCount === 0}
          onClick={() => {
            if (confirm(`Refund ${selection.selectedCount} selected payments?`)) {
              console.log('Refunding:', selection.selectedRows);
              // TODO: Implement refund logic
            }
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
        selection={selection}
        sorting={sorting}
        resize={resize}
        columns={[
          { 
            id: 'id', 
            header: 'Payment ID', 
            accessor: (row: PaymentTableRow) => row.id,
            width: '150px',
            resizable: true,
            sortable: true,
            cell: (row: PaymentTableRow) => (
              <button
                className={styles.copyableId}
                onClick={() => {
                  navigator.clipboard.writeText(row.id);
                  alert('Payment ID copied!');
                }}
                title={`Click to copy: ${row.id}`}
              >
                {row.id}
              </button>
            )
          },
          { 
            id: 'bookingId', 
            header: 'Booking ID', 
            accessor: (row: PaymentTableRow) => row.bookingId,
            width: '150px',
            resizable: true,
            sortable: true,
            cell: (row: PaymentTableRow) => (
              <button
                className={styles.copyableId}
                onClick={() => {
                  navigator.clipboard.writeText(row.bookingId);
                  alert('Booking ID copied!');
                }}
                title={`Click to copy: ${row.bookingId}`}
              >
                {row.bookingId}
              </button>
            )
          },
          {
            id: 'amount',
            header: 'Amount',
            accessor: (row: PaymentTableRow) => row.amount,
            sortable: true,
            resizable: true,
            width: '120px',
            cell: (row: PaymentTableRow) => (
              <span className={styles.amount}>
                {formatCurrency(row.amount / 100)}
              </span>
            )
          },
          { 
            id: 'status', 
            header: 'Status', 
            accessor: (row: PaymentTableRow) => row.status,
            sortable: true,
            resizable: true,
            width: '120px',
            cell: (row: PaymentTableRow) => (
              <span className={styles.statusBadge}>
                {row.status}
              </span>
            )
          },
          {
            id: 'createdAt',
            header: 'Created',
            accessor: (row: PaymentTableRow) => row.createdAt,
            sortable: true,
            resizable: true,
            width: '130px',
            cell: (row: PaymentTableRow) => (
              <span className={styles.date}>
                {formatDate(row.createdAt)}
              </span>
            )
          },
        ]}
        loading={loading}
        emptyState="No payment transactions found"
        striped={true}
        bordered={true}
        stickyHeader={true}
        ariaLabel="Payments table"
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
