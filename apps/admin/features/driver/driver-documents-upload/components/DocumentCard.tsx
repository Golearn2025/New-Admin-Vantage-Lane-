/**
 * Document Card Component
 *
 * Reusable card for displaying document with:
 * - Name & description
 * - Status badge
 * - Upload button
 * - Expiry date (if applicable)
 *
 * 100% UI-core components
 */

'use client';

import type { DocumentStatus, DocumentType } from '@entities/document';
import { getDocumentDescription, getDocumentLabel, requiresExpiryDate } from '@entities/document';
import type { BadgeColor } from '@vantage-lane/ui-core';
import { Badge, Button, Card } from '@vantage-lane/ui-core';
import { AlertCircle, Check, Clock, Upload, X } from 'lucide-react';
import React from 'react';
import styles from './DocumentCard.module.css';

interface Document {
  id?: string;
  status?: DocumentStatus;
  fileUrl?: string;
  expiryDate?: string;
  uploadDate?: string;
  rejectionReason?: string;
}

interface DocumentCardProps {
  documentType: DocumentType;
  document?: Document | undefined;
  onUpload: (documentType: DocumentType) => void;
}

import type { LucideProps } from 'lucide-react';

const STATUS_CONFIG: Record<DocumentStatus, { icon: React.ComponentType<LucideProps>; color: BadgeColor }> =
  {
    approved: { icon: Check, color: 'success' },
    pending: { icon: Clock, color: 'warning' },
    rejected: { icon: X, color: 'danger' },
    expired: { icon: AlertCircle, color: 'danger' },
    expiring_soon: { icon: AlertCircle, color: 'warning' },
  };

export function DocumentCard({ documentType, document, onUpload }: DocumentCardProps) {
  const label = getDocumentLabel(documentType);
  const description = getDocumentDescription(documentType);
  const hasExpiry = requiresExpiryDate(documentType);
  const cardClassName = styles.card || '';
  const badgeClassName = styles.badge || '';

  return (
    <Card className={cardClassName}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.title}>{label}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        {document && document.status ? (
          <Badge
            color={STATUS_CONFIG[document.status].color}
            size="sm"
            variant="solid"
            className={badgeClassName}
          >
            {React.createElement(STATUS_CONFIG[document.status].icon, { size: 12 })}
            <span>{document.status.replace('_', ' ')}</span>
          </Badge>
        ) : (
          <span className={styles.notUploaded}>Not uploaded</span>
        )}
      </div>

      {hasExpiry && document?.expiryDate && (
        <div className={styles.expiry}>
          <Clock size={16} />
          <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
        </div>
      )}

      {document?.rejectionReason && (
        <div className={styles.rejection}>
          <AlertCircle size={16} />
          <span>{document.rejectionReason}</span>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          onClick={() => onUpload(documentType)}
          variant="secondary"
          size="sm"
          leftIcon={<Upload size={16} />}
          className={styles.uploadButton}
        >
          {document?.fileUrl ? 'Re-upload' : 'Upload'}
        </Button>
      </div>
    </Card>
  );
}
