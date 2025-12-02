/**
 * DocumentsBulkActions Component
 * 
 * Bulk approve/reject functionality for documents
 * 
 * ✅ Zero any types
 * ✅ UI-core components
 * ✅ Lucide-react icons
 * ✅ Architecture: features → entities
 */

import { useState, useCallback, useMemo } from 'react';
import { bulkApproveDocuments, bulkRejectDocuments, type Document } from '@entities/document';
import { BulkActionsToolbar, type BulkAction } from '@vantage-lane/ui-core';
import { CheckCircle, XCircle } from 'lucide-react';
import { BulkRejectModal } from './BulkRejectModal';

interface DocumentsBulkActionsProps {
  selectedRows: Document[];
  adminId: string;
  actionLoading: boolean;
  onActionStarted: () => void;
  onActionCompleted: () => void;
  onRefetch: () => Promise<void>;
  onClearSelection: () => void;
}

export function DocumentsBulkActions({
  selectedRows,
  adminId,
  actionLoading,
  onActionStarted,
  onActionCompleted,
  onRefetch,
  onClearSelection,
}: DocumentsBulkActionsProps) {
  const [isBulkRejectOpen, setIsBulkRejectOpen] = useState(false);

  // Memoize selected IDs to prevent re-creation on every render
  const selectedIds = useMemo(() => 
    selectedRows.map((doc) => doc.id), 
    [selectedRows]
  );

  // Bulk approve handler
  const handleBulkApprove = useCallback(async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Approve ${selectedIds.length} document(s)?`)) return;

    try {
      onActionStarted();
      const result = await bulkApproveDocuments(selectedIds, adminId);

      if (result.failed > 0) {
        alert(`Approved ${result.success} document(s). Failed: ${result.failed}`);
      } else {
        alert(`Successfully approved ${result.success} document(s)`);
      }

      onClearSelection();
      await onRefetch();
    } catch (error) {
      console.error('Failed to bulk approve documents:', error);
      alert('Failed to approve documents. Please try again.');
    } finally {
      onActionCompleted();
    }
  }, [selectedIds, adminId, onActionStarted, onActionCompleted, onRefetch, onClearSelection]);

  // Bulk reject handler
  const handleBulkReject = useCallback(async () => {
    if (selectedIds.length === 0) return;

    setIsBulkRejectOpen(true);
  }, [selectedIds.length]);

  // Confirm bulk reject
  const handleConfirmBulkReject = useCallback(async (reason: string) => {

    try {
      onActionStarted();
      const result = await bulkRejectDocuments(selectedIds, adminId, reason);

      if (result.failed > 0) {
        alert(`Rejected ${result.success} document(s). Failed: ${result.failed}`);
      } else {
        alert(`Successfully rejected ${result.success} document(s)`);
      }

      setIsBulkRejectOpen(false);
      onClearSelection();
      await onRefetch();
    } catch (error) {
      console.error('Failed to bulk reject documents:', error);
      alert('Failed to reject documents. Please try again.');
    } finally {
      onActionCompleted();
    }
  }, [selectedIds, adminId, onActionStarted, onActionCompleted, onRefetch, onClearSelection]);

  // Memoized bulk actions configuration
  const bulkActions: BulkAction[] = useMemo(() => [
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
  ], [handleBulkApprove, handleBulkReject, actionLoading]);

  return (
    <>
      <BulkActionsToolbar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClearSelection={onClearSelection}
      />

      <BulkRejectModal
        isOpen={isBulkRejectOpen}
        onClose={() => setIsBulkRejectOpen(false)}
        onConfirm={handleConfirmBulkReject}
        count={selectedRows.length}
        loading={actionLoading}
      />
    </>
  );
}
