/**
 * Document Card Component
 * 
 * Display document with status, expiry, and actions.
 */

'use client';

import React from 'react';
import type { DocumentWithExpiry, DocumentType } from '../../../entities/driver-document';
import { getDocumentMetadata } from '../../../entities/driver-document';
import { ExpiryBadge } from './ExpiryBadge';
import styles from './DocumentCard.module.css';

interface DocumentCardProps {
  documentType: DocumentType;
  document: DocumentWithExpiry | null;
  onUpload: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export function DocumentCard({
  documentType,
  document,
  onUpload,
  onView,
  onDelete,
  onUpdate,
}: DocumentCardProps) {
  const metadata = getDocumentMetadata(documentType);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!document) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>{metadata.icon}</div>
          <div className={styles.info}>
            <h3 className={styles.title}>{metadata.label}</h3>
            <p className={styles.description}>{metadata.description}</p>
          </div>
        </div>

        {metadata.required && (
          <div className={styles.required}>* Required Document</div>
        )}

        <div className={styles.noDocument}>
          No document uploaded yet
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={onUpload}
          >
            Upload {metadata.label}
          </button>
        </div>
      </div>
    );
  }

  const isImage = document.mime_type?.startsWith('image/');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>{metadata.icon}</div>
        <div className={styles.info}>
          <h3 className={styles.title}>{metadata.label}</h3>
          <p className={styles.description}>{metadata.description}</p>
        </div>
      </div>

      <div className={styles.statusRow}>
        <ExpiryBadge document={document} />
        {metadata.required && (
          <div className={styles.required}>* Required</div>
        )}
      </div>

      {isImage && document.file_url && (
        <img
          src={document.file_url}
          alt={metadata.label}
          className={styles.thumbnail}
        />
      )}

      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <div className={styles.metadataLabel}>Uploaded</div>
          <div className={styles.metadataValue}>
            {formatDate(document.upload_date)}
          </div>
        </div>

        {document.expiry_date && (
          <div className={styles.metadataItem}>
            <div className={styles.metadataLabel}>Expires</div>
            <div className={styles.metadataValue}>
              {formatDate(document.expiry_date)}
            </div>
          </div>
        )}

        <div className={styles.metadataItem}>
          <div className={styles.metadataLabel}>File Name</div>
          <div className={styles.metadataValue}>
            {document.file_name || 'N/A'}
          </div>
        </div>

        <div className={styles.metadataItem}>
          <div className={styles.metadataLabel}>File Size</div>
          <div className={styles.metadataValue}>
            {formatFileSize(document.file_size)}
          </div>
        </div>
      </div>

      {document.rejection_reason && (
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <div className={styles.metadataLabel}>Rejection Reason</div>
            <div className={styles.metadataValue}>
              {document.rejection_reason}
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {onView && document.file_url && (
          <button
            type="button"
            className={styles.button}
            onClick={onView}
          >
            View
          </button>
        )}

        {onUpdate && document.status === 'pending' && (
          <button
            type="button"
            className={styles.button}
            onClick={onUpdate}
          >
            Update
          </button>
        )}

        {onDelete && document.status === 'pending' && (
          <button
            type="button"
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={onDelete}
          >
            Delete
          </button>
        )}

        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onUpload}
        >
          Re-upload
        </button>
      </div>
    </div>
  );
}
