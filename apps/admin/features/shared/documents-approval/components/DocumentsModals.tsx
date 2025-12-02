/**
 * DocumentsModals Component
 * 
 * All modal dialogs for documents approval flow
 * 
 * ✅ Zero any types
 * ✅ UI-core components
 * ✅ Centralized modal management
 */

import type { Document } from '@entities/document';
import { ApproveDocumentDialog } from './ApproveDocumentDialog';
import { DocumentViewerModal } from './DocumentViewerModal';
import { RejectDocumentModal } from './RejectDocumentModal';

interface DocumentsModalsProps {
  // Modal states
  selectedDocument: Document | null;
  isViewerOpen: boolean;
  isApproveOpen: boolean;
  isRejectOpen: boolean;
  actionLoading: boolean;
  
  // Actions
  onApprove: (doc: Document) => void;
  onReject: (doc: Document) => void;
  onConfirmApprove: () => void;
  onConfirmReject: (reason: string) => void;
  
  // Modal controls
  onCloseViewer: () => void;
  onCloseApprove: () => void;
  onCloseReject: () => void;
}

export function DocumentsModals({
  selectedDocument,
  isViewerOpen,
  isApproveOpen,
  isRejectOpen,
  actionLoading,
  onApprove,
  onReject,
  onConfirmApprove,
  onConfirmReject,
  onCloseViewer,
  onCloseApprove,
  onCloseReject,
}: DocumentsModalsProps) {
  return (
    <>
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={onCloseViewer}
        document={selectedDocument}
        onApprove={onApprove}
        onReject={onReject}
      />

      <ApproveDocumentDialog
        isOpen={isApproveOpen}
        onClose={onCloseApprove}
        onConfirm={onConfirmApprove}
        document={selectedDocument}
        loading={actionLoading}
      />

      <RejectDocumentModal
        isOpen={isRejectOpen}
        onClose={onCloseReject}
        onConfirm={onConfirmReject}
        document={selectedDocument}
        loading={actionLoading}
      />
    </>
  );
}
