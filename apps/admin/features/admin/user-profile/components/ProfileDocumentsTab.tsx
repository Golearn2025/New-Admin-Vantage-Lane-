/**
 * Profile Documents Tab Component
 * Displays all 13 driver documents with status
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React from 'react';
import type { Document } from '@entities/document';
import { getDocumentLabel, getDocumentDescription } from '@entities/document';
import styles from './ProfileDocumentsTab.module.css';

export interface ProfileDocumentsTabProps {
  documents: Document[];
  onViewDocument?: (doc: Document) => void;
  onApprove?: (doc: Document) => void;
  onReject?: (doc: Document) => void;
}

export function ProfileDocumentsTab({
  documents,
  onViewDocument,
  onApprove,
  onReject,
}: ProfileDocumentsTabProps) {
  // Group documents by category
  const driverDocs = documents.filter((d) => d.category === 'driver');
  const vehicleDocs = documents.filter((d) => d.category === 'vehicle');
  
  const renderDocumentCard = (doc: Document) => {
    const statusClass = `status${doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace('_', '')}`;
    
    return (
      <div key={doc.id} className={styles.docCard}>
        <div className={styles.docHeader}>
          <div className={styles.docInfo}>
            <h4 className={styles.docName}>{getDocumentLabel(doc.type)}</h4>
            <p className={styles.docDescription}>{getDocumentDescription(doc.type)}</p>
          </div>
          <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
            {doc.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className={styles.docMeta}>
          {doc.uploadDate && (
            <span className={styles.metaItem}>
              📅 Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
            </span>
          )}
          {doc.expiryDate && (
            <span className={styles.metaItem}>
              ⏰ Expires: {new Date(doc.expiryDate).toLocaleDateString('en-GB')}
            </span>
          )}
          {doc.isRequired && (
            <span className={styles.required}>⚠️ Required</span>
          )}
        </div>
        
        {doc.rejectionReason && (
          <div className={styles.rejectionReason}>
            <strong>Rejection Reason:</strong> {doc.rejectionReason}
          </div>
        )}
        
        <div className={styles.docActions}>
          {onViewDocument && doc.fileUrl && (
            <button
              className={styles.actionBtn}
              onClick={() => onViewDocument(doc)}
            >
              👁️ View
            </button>
          )}
          {doc.status === 'pending' && onApprove && (
            <button
              className={`${styles.actionBtn} ${styles.approveBtn}`}
              onClick={() => onApprove(doc)}
            >
              ✅ Approve
            </button>
          )}
          {doc.status === 'pending' && onReject && (
            <button
              className={`${styles.actionBtn} ${styles.rejectBtn}`}
              onClick={() => onReject(doc)}
            >
              ❌ Reject
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.container}>
      {/* Driver Documents Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🪪 Driver Documents</h3>
          <span className={styles.count}>{driverDocs.length} documents</span>
        </div>
        <div className={styles.docsGrid}>
          {driverDocs.length > 0 ? (
            driverDocs.map(renderDocumentCard)
          ) : (
            <p className={styles.emptyState}>No driver documents found</p>
          )}
        </div>
      </div>
      
      {/* Vehicle Documents Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🚗 Vehicle Documents</h3>
          <span className={styles.count}>{vehicleDocs.length} documents</span>
        </div>
        <div className={styles.docsGrid}>
          {vehicleDocs.length > 0 ? (
            vehicleDocs.map(renderDocumentCard)
          ) : (
            <p className={styles.emptyState}>No vehicle documents found</p>
          )}
        </div>
      </div>
    </div>
  );
}
