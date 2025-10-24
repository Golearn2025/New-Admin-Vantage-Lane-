/**
 * Documents Approval Table Component
 * Main component with tabs, search, table, bulk actions
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React from 'react';
import { DataTable, Input, TableActions, Pagination } from '@vantage-lane/ui-core';
import { useDocumentsApproval } from '../hooks/useDocumentsApproval';
import { getDocumentsColumns } from '../columns/documentsColumns';
import styles from './DocumentsApprovalTable.module.css';

export interface DocumentsApprovalTableProps {
  className?: string;
}

export function DocumentsApprovalTable({ className }: DocumentsApprovalTableProps) {
  const {
    documents,
    loading,
    error,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
    counts,
    refetch,
  } = useDocumentsApproval();
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  
  // Paginate
  const paginatedDocs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return documents.slice(start, start + pageSize);
  }, [documents, currentPage, pageSize]);
  
  const totalPages = Math.ceil(documents.length / pageSize);
  
  const columns = getDocumentsColumns({
    onApprove: (doc) => console.log('Approve:', doc),
    onReject: (doc) => console.log('Reject:', doc),
    onView: (doc) => console.log('View:', doc),
  });
  
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Documents Approval</h1>
          <span className={styles.subtitle}>
            Review and approve driver & operator documents
          </span>
        </div>
        
        <div className={styles.headerRight}>
          <Input
            type="search"
            placeholder="Search by name, email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            size="md"
          />
          
          <TableActions
            onExport={() => console.log('Export')}
            onRefresh={refetch}
            loading={loading}
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={filters.tab === 'pending' ? styles.tabActive : styles.tab}
          onClick={() => setFilters({ ...filters, tab: 'pending' })}
        >
          Pending
          {counts.pending > 0 && (
            <span className={styles.badge}>{counts.pending}</span>
          )}
        </button>
        
        <button
          className={filters.tab === 'expiring' ? styles.tabActive : styles.tab}
          onClick={() => setFilters({ ...filters, tab: 'expiring' })}
        >
          Expiring Soon
          {counts.expiring_soon > 0 && (
            <span className={styles.badgeWarning}>{counts.expiring_soon}</span>
          )}
        </button>
        
        <button
          className={filters.tab === 'expired' ? styles.tabActive : styles.tab}
          onClick={() => setFilters({ ...filters, tab: 'expired' })}
        >
          Expired
          {counts.expired > 0 && (
            <span className={styles.badgeDanger}>{counts.expired}</span>
          )}
        </button>
        
        <button
          className={filters.tab === 'all' ? styles.tabActive : styles.tab}
          onClick={() => setFilters({ ...filters, tab: 'all' })}
        >
          All Documents
        </button>
      </div>
      
      {/* Loading */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading documents...</p>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error: {error}</p>
          <button className={styles.retryButton} onClick={refetch}>
            Retry
          </button>
        </div>
      )}
      
      {/* Table */}
      {!loading && !error && (
        <>
          <div className={styles.tableContainer}>
            <DataTable data={paginatedDocs} columns={columns} />
          </div>
          
          {documents.length > 0 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={documents.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
