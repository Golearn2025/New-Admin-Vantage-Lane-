import { CheckCircle, Hourglass } from 'lucide-react';
/**
 * Documents Page Content Component
 * 
 * Client component with all document management logic.
 * Separated from page.tsx to follow clean architecture.
 */

'use client';

import React, { useState } from 'react';
import { DocumentCard } from '../../../features/document-card';
import { DocumentUpload } from '../../../features/document-upload';
import { useDocuments } from '../../../features/documents-manager/hooks';
import { DRIVER_DOCUMENT_TYPES } from '../../../entities/driver-document';
import type { DocumentType } from '../../../entities/driver-document';
import styles from './page.module.css';

interface DocumentsPageContentProps {
  driverId: string;
}

export function DocumentsPageContent({ driverId }: DocumentsPageContentProps) {
  const { documents, loading, error, uploadDocument, deleteDocument, getDocumentByType } =
    useDocuments();
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);

  if (loading) {
    return <div className={styles.loading}>Loading documents...</div>;
  }

  const handleUpload = async (type: DocumentType, file: File, expiryDate?: string) => {
    const payload: any = {
      document_type: type,
      file,
    };
    if (expiryDate) {
      payload.expiry_date = expiryDate;
    }
    await uploadDocument(driverId, payload);
    setUploadingType(null);
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(documentId);
    }
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  // Calculate stats
  const totalDocs = documents.length;
  const approvedDocs = documents.filter((d) => d.status === 'approved').length;
  const pendingDocs = documents.filter((d) => d.status === 'pending').length;
  const expiredDocs = documents.filter((d) => d.is_expired).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Documents</h1>
        <p className={styles.description}>
          Upload and manage your driver documents. Keep them up to date to maintain active status.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📄</div>
          <div className={styles.statLabel}>Total Documents</div>
          <div className={styles.statValue}>{totalDocs}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><CheckCircle size={18} strokeWidth={2} /></div>
          <div className={styles.statLabel}>Approved</div>
          <div className={styles.statValue}>{approvedDocs}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Hourglass size={18} strokeWidth={2} /></div>
          <div className={styles.statLabel}>Pending Review</div>
          <div className={styles.statValue}>{pendingDocs}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statLabel}>Expired</div>
          <div className={styles.statValue}>{expiredDocs}</div>
        </div>
      </div>

      {/* Driver Documents Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Driver Documents</h2>
        <div className={styles.grid}>
          {DRIVER_DOCUMENT_TYPES.map((type) => {
            const doc = getDocumentByType(type);
            const isUploading = uploadingType === type;

            return (
              <div key={type}>
                {isUploading ? (
                  <DocumentUpload
                    documentType={type}
                    onUpload={(file, expiryDate) => handleUpload(type, file, expiryDate)}
                    disabled={false}
                  />
                ) : (
                  <DocumentCard
                    documentType={type}
                    document={doc}
                    onUpload={() => setUploadingType(type)}
                    {...(doc?.file_url && { onView: () => handleView(doc.file_url!) })}
                    {...(doc && { onDelete: () => handleDelete(doc.id) })}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
