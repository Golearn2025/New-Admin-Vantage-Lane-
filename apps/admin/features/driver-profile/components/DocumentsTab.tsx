/**
 * DocumentsTab Component
 * 
 * Driver documents table with approve/reject actions
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { DocumentData } from '@entities/driver';
import { EnterpriseDataTable, ErrorBanner, Card } from '@vantage-lane/ui-core';
import { RejectDocumentModal } from '@features/documents-approval/components/RejectDocumentModal';
import { useDriverDocuments } from '../hooks/useDriverDocuments';
import { useDriverActions } from '../hooks/useDriverActions';
import { getDocumentColumns } from '../columns/documentColumns';
import styles from '../driver-profile.module.css';

interface DocumentsTabProps {
  driverId: string;
}

export function DocumentsTab({ driverId }: DocumentsTabProps) {
  const { documents, error, isLoading, mutate } = useDriverDocuments(driverId);
  const { approveDocument, rejectDocument, isLoading: isActionLoading, error: actionError } = useDriverActions();
  
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleView = useCallback((document: DocumentData) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  }, []);

  const handleApprove = useCallback(async (document: DocumentData) => {
    try {
      // TODO: Get admin user ID from auth context
      const adminUserId = 'temp-admin-id';
      await approveDocument(document.id, adminUserId);
      mutate();
    } catch (err) {
      // Error handled by hook
    }
  }, [approveDocument, mutate]);

  const handleRejectClick = useCallback((document: DocumentData) => {
    setSelectedDocument(document);
    setRejectDialogOpen(true);
  }, []);

  const handleRejectConfirm = useCallback(async (reason: string) => {
    if (!selectedDocument) return;

    try {
      // TODO: Get actual admin user ID from auth context
      const adminUserId = 'admin-user-id';
      await rejectDocument(selectedDocument.id, reason, adminUserId);
      await mutate();
      setRejectDialogOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error('Failed to reject document:', err);
    }
  }, [selectedDocument, rejectDocument, mutate]);

  const handleRejectCancel = useCallback(() => {
    setRejectDialogOpen(false);
    setSelectedDocument(null);
  }, []);

  const columns = useMemo(
    () =>
      getDocumentColumns({
        onView: handleView,
        onApprove: handleApprove,
        onReject: handleRejectClick,
      }),
    [handleView, handleApprove, handleRejectClick]
  );

  // Separate documents by category
  const driverDocuments = useMemo(
    () => documents.filter(doc => doc.documentCategory === 'driver'),
    [documents]
  );

  const vehicleDocuments = useMemo(
    () => documents.filter(doc => doc.documentCategory === 'vehicle'),
    [documents]
  );

  if (error) {
    return <ErrorBanner message={error.message} actionLabel="Retry" onAction={mutate} />;
  }

  return (
    <div className={styles.documentsTab}>
      {/* Driver Documents Section */}
      <Card>
        <h3 className={styles.sectionTitle}>Driver Documents</h3>
        <EnterpriseDataTable
          data={driverDocuments}
          columns={columns}
          loading={isLoading}
          emptyState="No driver documents uploaded yet"
        />
      </Card>

      {/* Vehicle Documents Section */}
      <Card>
        <h3 className={styles.sectionTitle}>Vehicle Documents</h3>
        <EnterpriseDataTable
          data={vehicleDocuments}
          columns={columns}
          loading={isLoading}
          emptyState="No vehicle documents uploaded yet"
        />
      </Card>

      <RejectDocumentModal
        isOpen={rejectDialogOpen}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        document={selectedDocument ? {
          id: selectedDocument.id,
          type: selectedDocument.documentType,
          userName: 'Driver', // TODO: Get actual driver name
          status: selectedDocument.status,
        } as any : null}
        loading={isActionLoading}
      />
    </div>
  );
}
