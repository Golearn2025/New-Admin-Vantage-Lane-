/**
 * Document Viewer Modal
 * Preview document with metadata and actions
 * 
 * MODERN & PREMIUM - 100% ui-core components + lucide-react icons
 */

'use client';

import { Modal, Button } from '@vantage-lane/ui-core';
import { FileText, Download, Calendar, User, FileType, CheckCircle, XCircle } from 'lucide-react';
import type { Document } from '@entities/document';
import styles from './DocumentViewerModal.module.css';

export interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onApprove?: (document: Document) => void;
  onReject?: (document: Document) => void;
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  document,
  onApprove,
  onReject,
}: DocumentViewerModalProps) {
  if (!document) return null;

  const handleDownload = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Preview"
      size="xl"
      showCloseButton={true}
    >
      <div className={styles.container}>
        {/* Document Preview */}
        <div className={styles.previewSection}>
          {document.fileUrl ? (
            <div className={styles.previewWrapper}>
              {document.mimeType?.startsWith('image/') ? (
                <img
                  src={document.fileUrl}
                  alt={document.name}
                  className={styles.previewImage}
                />
              ) : (
                <iframe
                  src={document.fileUrl}
                  title={document.name}
                  className={styles.previewFrame}
                />
              )}
            </div>
          ) : (
            <div className={styles.noPreview}>
              <FileText size={48} />
              <p>No preview available</p>
            </div>
          )}
        </div>

        {/* Document Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoHeader}>
            <FileText size={20} />
            <h3>Document Information</h3>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <User size={16} />
              <div>
                <span className={styles.infoLabel}>Driver</span>
                <span className={styles.infoValue}>{document.userName}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FileType size={16} />
              <div>
                <span className={styles.infoLabel}>Type</span>
                <span className={styles.infoValue}>{document.type}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Calendar size={16} />
              <div>
                <span className={styles.infoLabel}>Uploaded</span>
                <span className={styles.infoValue}>
                  {formatDate(document.uploadDate)}
                </span>
              </div>
            </div>

            {document.expiryDate && (
              <div className={styles.infoItem}>
                <Calendar size={16} />
                <div>
                  <span className={styles.infoLabel}>Expires</span>
                  <span className={styles.infoValue}>
                    {formatDate(document.expiryDate)}
                  </span>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <FileText size={16} />
              <div>
                <span className={styles.infoLabel}>File Size</span>
                <span className={styles.infoValue}>
                  {formatFileSize(document.fileSize)}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FileType size={16} />
              <div>
                <span className={styles.infoLabel}>Format</span>
                <span className={styles.infoValue}>
                  {document.mimeType || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {document.description && (
            <div className={styles.description}>
              <span className={styles.infoLabel}>Notes</span>
              <p>{document.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
            >
              Close
            </Button>
            {document.fileUrl && (
              <Button
                variant="outline"
                size="md"
                leftIcon={<Download size={16} />}
                onClick={handleDownload}
              >
                Download
              </Button>
            )}
          </div>

          {/* Quick Actions - Approve/Reject */}
          {document.status === 'pending' && (onApprove || onReject) && (
            <div className={styles.quickActions}>
              {onReject && (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<XCircle size={16} />}
                  onClick={() => onReject(document)}
                  className={styles.rejectButton}
                >
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<CheckCircle size={16} />}
                  onClick={() => onApprove(document)}
                >
                  Approve
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
