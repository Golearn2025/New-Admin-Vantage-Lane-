/**
 * DriverVerification Component
 * Full driver verification page with ALL documents + actions
 */

'use client';

import { Bus, Hourglass, Truck, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { DocumentViewer } from '@features/document-viewer';
import { useDriverVerification } from '../hooks/useDriverVerification';
import type { DriverDoc } from '../types';
import styles from './DriverVerification.module.css';

export interface DriverVerificationProps {
  driverId: string;
}

export function DriverVerification({ driverId }: DriverVerificationProps) {
  const { driver, loading, verifyDriver, rejectDriver, assignToOperator } = useDriverVerification(driverId);
  const [selectedDoc, setSelectedDoc] = useState<DriverDoc | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (loading) {
    return <div className={styles.loading}>Loading driver data...</div>;
  }

  if (!driver) {
    return <div className={styles.error}>Driver not found</div>;
  }

  const allDocsVerified = driver.documents.every((d) => d.verified);
  const hasPhoto = !!driver.profilePhoto;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleActivate = async () => {
    if (selectedCategories.length === 0) {
      alert('⚠️ Select at least one vehicle category!');
      return;
    }
    await verifyDriver(selectedCategories);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Driver Verification</h1>
          <p className={styles.subtitle}>{driver.firstName} {driver.lastName}</p>
        </div>
        <div className={styles.status}>
          {driver.status === 'pending' && <span className={styles.statusPending}>⏳ Pending</span>}
          {driver.status === 'verified' && <span className={styles.statusVerified}>✓ Verified</span>}
          {driver.status === 'rejected' && <span className={styles.statusRejected}>✗ Rejected</span>}
        </div>
      </div>

      {/* Profile Photo */}
      <div className={styles.section}>
        <h3>Profile Photo</h3>
        {driver.profilePhoto ? (
          <img src={driver.profilePhoto} alt="Profile" className={styles.profilePhoto} />
        ) : (
          <div className={styles.noPhoto}>❌ No profile photo uploaded</div>
        )}
      </div>

      {/* Documents Grid */}
      <div className={styles.section}>
        <h3>Documents ({driver.documents.filter(d => d.verified).length}/{driver.documents.length} verified)</h3>
        <div className={styles.docsGrid}>
          {driver.documents.map((doc) => (
            <div key={doc.id} className={styles.docCard}>
              <div className={styles.docHeader}>
                <span className={styles.docType}>{doc.type.toUpperCase()}</span>
                {doc.verified ? (
                  <span className={styles.docVerified}>✓</span>
                ) : (
                  <span className={styles.docPending}><Hourglass size={18} strokeWidth={2} /></span>
                )}
              </div>
              <div className={styles.docPreview}>
                {doc.type === 'photo' ? (
                  <img src={doc.url} alt={doc.type} className={styles.docImage} />
                ) : (
                  <div className={styles.pdfIcon}>📄</div>
                )}
              </div>
              <Button size="sm" variant="secondary" onClick={() => setSelectedDoc(doc)}>
                View Full
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Categories Selection */}
      <div className={styles.section}>
        <h3>Vehicle Categories</h3>
        <p className={styles.sectionDesc}>Select categories this driver can accept</p>
        <div className={styles.categoriesGrid}>
          {['EXEC', 'LUX', 'VAN', 'SUV'].map((cat) => (
            <label key={cat} className={styles.categoryCard}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className={styles.categoryCheckbox}
              />
              <div className={styles.categoryContent}>
                <span className={styles.categoryIcon}>
                  {cat === 'EXEC' && '🎩'}
                  {cat === 'LUX' && '💎'}
                  {cat === 'VAN' && '🚐'}
                  {cat === 'SUV' && '🚙'}
                </span>
                <span className={styles.categoryName}>{cat}</span>
              </div>
            </label>
          ))}
        </div>
        <p className={styles.categoryNote}>
          Driver will see ONLY bookings matching selected categories
        </p>
      </div>

      {/* Contact Info */}
      <div className={styles.section}>
        <h3>Contact Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{driver.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phone:</span>
            <span className={styles.infoValue}>{driver.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Registered:</span>
            <span className={styles.infoValue}>{new Date(driver.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="danger" onClick={() => rejectDriver()}>
          ✗ Reject Driver
        </Button>
        <Button
          variant="primary"
          onClick={handleActivate}
          disabled={!allDocsVerified || !hasPhoto}
        >
          ✓ Activate Driver
        </Button>
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewer
          document={{
            id: selectedDoc.id,
            url: selectedDoc.url,
            name: selectedDoc.type,
            type: selectedDoc.type === 'photo' ? 'image' : 'pdf',
            uploadedAt: selectedDoc.uploadedAt,
            verified: selectedDoc.verified,
          }}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
