/**
 * Approve Document Dialog
 * Confirmation dialog for approving documents
 * 
 * Uses ConfirmDialog from ui-core - 100% reusable
 */

'use client';

import { ConfirmDialog } from '@vantage-lane/ui-core';
import type { Document } from '@entities/document';

export interface ApproveDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  document: Document | null;
  loading?: boolean;
}

export function ApproveDocumentDialog({
  isOpen,
  onClose,
  onConfirm,
  document,
  loading = false,
}: ApproveDocumentDialogProps) {
  if (!document) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Approve Document?"
      message={`Are you sure you want to approve the ${document.type} document for ${document.userName}? This action will mark the document as approved.`}
      confirmLabel="Approve"
      cancelLabel="Cancel"
      variant="info"
      loading={loading}
    />
  );
}
