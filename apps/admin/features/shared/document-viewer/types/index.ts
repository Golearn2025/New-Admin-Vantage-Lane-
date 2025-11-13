/**
 * DocumentViewer Types
 */

export type DocumentType = 'pdf' | 'image';

export interface Document {
  id: string;
  url: string;
  name: string;
  type: DocumentType;
  uploadedAt: string;
  verified: boolean;
}

export interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
  onVerify?: (documentId: string) => void;
  onReject?: (documentId: string) => void;
  onDownload?: (document: Document) => void;
}
