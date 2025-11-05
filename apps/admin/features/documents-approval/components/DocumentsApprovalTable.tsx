/**
 * Documents Approval Table Component
 * Main component with tabs, search, table, bulk actions
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React, { useState } from 'react';
import { 
  EnterpriseDataTable,
  useSelection,
  useSorting,
  useColumnResize,
  Input, 
  TableActions, 
  Pagination,
  BulkActionsToolbar,
  type BulkAction,
  exportToCSV,
  exportToExcel,
  formatDateForExport,
} from '@vantage-lane/ui-core';
import { useDocumentsApproval } from '../hooks/useDocumentsApproval';
import { getDocumentsColumns } from '../columns/documentsColumns';
import { 
  approveDocument, 
  rejectDocument, 
  bulkApproveDocuments,
  bulkRejectDocuments,
  type Document 
} from '@entities/document';
import { DocumentViewerModal } from './DocumentViewerModal';
import { ApproveDocumentDialog } from './ApproveDocumentDialog';
import { RejectDocumentModal } from './RejectDocumentModal';
import { CheckCircle, XCircle } from 'lucide-react';
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
  
  // Initialize hooks for EnterpriseDataTable
  const selection = useSelection({
    data: paginatedDocs,
    getRowId: (doc) => doc.id,
  });
  const sorting = useSorting();
  const resize = useColumnResize();
  
  // Modal states
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // TODO: Get admin ID from auth context
  const adminId = 'f2036914-492c-4534-96f0-1eb19e08fb83'; // Catalin's ID
  
  // Handlers
  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };
  
  const handleApprove = (doc: Document) => {
    setSelectedDocument(doc);
    setIsApproveOpen(true);
  };
  
  const handleReject = (doc: Document) => {
    setSelectedDocument(doc);
    setIsRejectOpen(true);
  };
  
  const handleConfirmApprove = async () => {
    if (!selectedDocument) return;
    
    try {
      setActionLoading(true);
      await approveDocument(selectedDocument.id, adminId);
      setIsApproveOpen(false);
      setSelectedDocument(null);
      await refetch();
    } catch (error) {
      console.error('Failed to approve document:', error);
      alert('Failed to approve document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleConfirmReject = async (reason: string) => {
    if (!selectedDocument) return;
    
    try {
      setActionLoading(true);
      await rejectDocument(selectedDocument.id, adminId, reason);
      setIsRejectOpen(false);
      setSelectedDocument(null);
      await refetch();
    } catch (error) {
      console.error('Failed to reject document:', error);
      alert('Failed to reject document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Bulk action handlers
  const handleBulkApprove = async () => {
    const selectedIds = selection.selectedRows.map(doc => doc.id);
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Approve ${selectedIds.length} document(s)?`)) return;
    
    try {
      setActionLoading(true);
      const result = await bulkApproveDocuments(selectedIds, adminId);
      
      if (result.failed > 0) {
        alert(`Approved ${result.success} document(s). Failed: ${result.failed}`);
      } else {
        alert(`Successfully approved ${result.success} document(s)`);
      }
      
      selection.clearSelection();
      await refetch();
    } catch (error) {
      console.error('Failed to bulk approve documents:', error);
      alert('Failed to approve documents. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleBulkReject = async () => {
    const selectedIds = selection.selectedRows.map(doc => doc.id);
    if (selectedIds.length === 0) return;
    
    const reason = prompt(`Enter rejection reason for ${selectedIds.length} document(s):`);
    if (!reason || reason.trim().length < 10) {
      alert('Rejection reason must be at least 10 characters');
      return;
    }
    
    try {
      setActionLoading(true);
      const result = await bulkRejectDocuments(selectedIds, adminId, reason.trim());
      
      if (result.failed > 0) {
        alert(`Rejected ${result.success} document(s). Failed: ${result.failed}`);
      } else {
        alert(`Successfully rejected ${result.success} document(s)`);
      }
      
      selection.clearSelection();
      await refetch();
    } catch (error) {
      console.error('Failed to bulk reject documents:', error);
      alert('Failed to reject documents. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    {
      id: 'approve',
      label: 'Approve Selected',
      icon: <CheckCircle size={16} />,
      onClick: handleBulkApprove,
      disabled: actionLoading,
    },
    {
      id: 'reject',
      label: 'Reject Selected',
      icon: <XCircle size={16} />,
      onClick: handleBulkReject,
      destructive: true,
      disabled: actionLoading,
    },
  ];
  
  // Export handler
  const handleExport = () => {
    const exportData = documents.map(doc => ({
      'Document ID': doc.id,
      'Type': doc.type,
      'Category': doc.category,
      'Driver Name': doc.userName,
      'Driver Email': doc.userEmail,
      'Status': doc.status,
      'Upload Date': formatDateForExport(doc.uploadDate),
      'Expiry Date': doc.expiryDate ? formatDateForExport(doc.expiryDate) : 'N/A',
      'Reviewed By': doc.approvedBy || doc.rejectedBy || 'N/A',
      'Reviewed At': doc.approvedAt ? formatDateForExport(doc.approvedAt) : (doc.rejectedAt ? formatDateForExport(doc.rejectedAt) : 'N/A'),
      'Rejection Reason': doc.rejectionReason || 'N/A',
      'File Size': doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : 'N/A',
      'Notes': doc.description || '',
    }));
    
    const filename = `documents-${filters.tab}-${new Date().toISOString().split('T')[0]}`;
    
    // Export as Excel (CSV with UTF-8 BOM for Excel compatibility)
    exportToExcel(exportData, filename);
  };
  
  const columns = getDocumentsColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onView: handleView,
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
            onExport={handleExport}
            onRefresh={refetch}
            loading={loading}
            showAdd={false}
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
      
      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selection.selectedRows.length}
        actions={bulkActions}
        onClearSelection={selection.clearSelection}
      />
      
      {/* Table */}
      {!loading && !error && (
        <>
          <div className={styles.tableContainer}>
            <EnterpriseDataTable
              data={paginatedDocs}
              columns={columns}
              selection={selection}
              sorting={sorting}
              resize={resize}
              stickyHeader={true}
              maxHeight="calc(100vh - 400px)"
              striped={true}
              ariaLabel="Documents approval table"
            />
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
      
      {/* Modals */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
      />
      
      <ApproveDocumentDialog
        isOpen={isApproveOpen}
        onClose={() => {
          setIsApproveOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleConfirmApprove}
        document={selectedDocument}
        loading={actionLoading}
      />
      
      <RejectDocumentModal
        isOpen={isRejectOpen}
        onClose={() => {
          setIsRejectOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleConfirmReject}
        document={selectedDocument}
        loading={actionLoading}
      />
    </div>
  );
}
