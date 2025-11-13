/**
 * DriverVerification Component
 * Full driver verification page with ALL documents + actions
 */

'use client';

import React, { useState } from 'react';
import { 
  Avatar,
  Card,
  Badge,
  Checkbox,
  ProfileSection,
  Button 
} from '@vantage-lane/ui-core';
import { Check, X, Clock, AlertCircle, Car, User } from 'lucide-react';
import { DocumentViewer } from '@features/shared/document-viewer';
import { useDriverVerification } from '../hooks/useDriverVerification';
import type { DriverDoc } from '../types';
import type { VehicleServiceType } from '@entities/driver';
import styles from './DriverVerification.module.css';

export interface DriverVerificationProps {
  driverId: string;
}

export function DriverVerification({ driverId }: DriverVerificationProps) {
  const { driver, loading, error, verifyDriver, rejectDriver, approveDocument, rejectDocument } = useDriverVerification(driverId);
  const [selectedDoc, setSelectedDoc] = useState<DriverDoc | null>(null);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<VehicleServiceType[]>([]);

  if (loading) {
    return <div className={styles.loading}>Loading driver data...</div>;
  }

  if (!driver) {
    return <div className={styles.error}>Driver not found</div>;
  }

  const allDocsVerified = driver.documents.every((d) => d.verified);
  const hasPhoto = !!driver.profilePhoto;

  const toggleServiceType = (type: VehicleServiceType) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleActivate = async () => {
    if (selectedServiceTypes.length === 0) {
      alert('⚠️ Select at least one service type!');
      return;
    }
    await verifyDriver(selectedServiceTypes);
  };
  
  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    await rejectDriver(reason);
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
          {driver.status === 'pending' && <Badge color="warning" icon="clock">Pending</Badge>}
          {driver.status === 'pending_approval' && <Badge color="warning" icon="clock">Pending Approval</Badge>}
          {driver.status === 'active' && <Badge color="success" icon="check">Active</Badge>}
          {driver.status === 'verified' && <Badge color="success" icon="check">Verified</Badge>}
          {driver.status === 'rejected' && <Badge color="danger" icon="x">Rejected</Badge>}
          {driver.status === 'inactive' && <Badge color="neutral">Inactive</Badge>}
          {driver.status === 'suspended' && <Badge color="danger">Suspended</Badge>}
        </div>
      </div>

      {/* Profile Photo */}
      <Card padding="lg">
        <h3>Profile Photo</h3>
        {driver.profilePhoto ? (
          <Avatar 
            src={driver.profilePhoto} 
            alt={`${driver.firstName} ${driver.lastName}`}
            name={`${driver.firstName} ${driver.lastName}`}
            size="2xl"
          />
        ) : (
          <div className={styles.noPhoto}>
            <User size={48} />
            <p>No profile photo uploaded</p>
          </div>
        )}
      </Card>

      {/* Documents Grid */}
      <Card padding="lg">
        <h3>Documents ({driver.documents.filter(d => d.verified).length}/{driver.documents.length} verified)</h3>
        <div className={styles.docsGrid}>
          {driver.documents.map((doc) => (
            <div key={doc.id} className={styles.docCard}>
              <div className={styles.docHeader}>
                <Badge color="neutral" size="sm">{doc.type.toUpperCase()}</Badge>
                {doc.verified ? (
                  <Badge color="success" icon="check" size="sm">Verified</Badge>
                ) : (
                  <Badge color="warning" icon="clock" size="sm">Pending</Badge>
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
      </Card>

      {/* Vehicle Categories Selection */}
      <Card padding="lg">
        <h3>Vehicle Categories</h3>
        <p className={styles.sectionDesc}>Select categories this driver can accept</p>
        <div className={styles.categoriesGrid}>
          {(['exec', 'lux', 'suv', 'van'] as const).map((type) => {
            const serviceLabels = {
              exec: 'EXEC - Executive (BMW 5, Mercedes E-Class)',
              lux: 'LUX - Luxury (S-Class, 7 Series)',
              suv: 'SUV - Premium SUV (Range Rover)',
              van: 'VAN - Group Transport (V-Class)'
            };
            const serviceIcons = {
              exec: '🎩',
              lux: '💎',
              suv: '🚙',
              van: '🚐'
            };
            
            return (
              <label key={type} className={styles.categoryCard}>
                <Checkbox
                  id={`service-${type}`}
                  checked={selectedServiceTypes.includes(type)}
                  onChange={() => toggleServiceType(type)}
                  className={styles.categoryCheckbox}
                />
                <div className={styles.categoryContent}>
                  <span className={styles.categoryIcon}>{serviceIcons[type]}</span>
                  <span className={styles.categoryName}>{serviceLabels[type]}</span>
                </div>
              </label>
            );
          })}
        </div>
        <p className={styles.categoryNote}>
          Driver will see ONLY bookings matching selected categories
        </p>
      </Card>

      {/* Contact Info */}
      <ProfileSection 
        title="Contact Information"
        icon="📧"
        variant="default"
      >
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
      </ProfileSection>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="danger" onClick={handleReject}>
          <X size={18} /> Reject Driver
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
