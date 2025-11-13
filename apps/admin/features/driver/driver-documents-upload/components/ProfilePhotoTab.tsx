/**
 * Profile Photo Tab
 * 
 * Simple photo upload with preview
 * Zero logic - delegates to hook
 */

'use client';

import React from 'react';
import { Card, Button, Avatar, Badge } from '@vantage-lane/ui-core';
import { Upload, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DocumentUploadModal } from './DocumentUploadModal';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import styles from './ProfilePhotoTab.module.css';

export function ProfilePhotoTab() {
  const {
    photoUrl,
    pendingPhotoUrl,
    status,
    isLoading,
    uploadModalOpen,
    handleUpload,
    handleCloseModal,
    handleUploadFile,
  } = useProfilePhoto();

  // Status badge configuration
  const statusConfig = {
    none: { label: 'No Photo', color: 'neutral' as const },
    approved: { label: 'Approved', color: 'success' as const },
    pending: { label: 'Pending Review', color: 'warning' as const },
    rejected: { label: 'Rejected', color: 'danger' as const },
  };

  const currentStatus = statusConfig[status];

  const cardClassName = styles.card || '';

  return (
    <div className={styles.container}>
      <Card className={cardClassName}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>Profile Photo</h2>
            <Badge 
              color={currentStatus.color}
              variant="soft"
              size="md"
            >
              {currentStatus.label}
            </Badge>
          </div>
          <p className={styles.description}>
            Upload a professional photo for your driver profile
          </p>
        </div>

        <div className={styles.preview}>
          {/* Current Approved Photo */}
          <div className={styles.photoContainer}>
            {photoUrl ? (
              <>
                <Avatar
                  src={photoUrl}
                  alt="Current profile photo"
                  size="xl"
                />
                <div className={styles.photoLabel}>Current Photo</div>
              </>
            ) : (
              <div className={styles.placeholder}>
                <User size={64} />
                <div className={styles.photoLabel}>No Photo</div>
              </div>
            )}
          </div>

          {/* Pending Photo (if exists) */}
          {pendingPhotoUrl && (
            <div className={styles.photoContainer}>
              <Avatar
                src={pendingPhotoUrl}
                alt="Pending profile photo"
                size="xl"
              />
              <div className={styles.photoLabel}>
                <Clock size={14} />
                Pending Approval
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleUpload}
            variant="primary"
            size="md"
            leftIcon={<Upload size={16} />}
          >
            {photoUrl ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </div>

        <div className={styles.requirements}>
          <h3 className={styles.requirementsTitle}>Photo Requirements:</h3>
          <ul className={styles.requirementsList}>
            <li>Clear, professional headshot</li>
            <li>Face clearly visible (no sunglasses)</li>
            <li>Neutral background preferred</li>
            <li>JPEG or PNG format</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </div>
      </Card>

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseModal}
        documentType="profile_photo"
        onUpload={handleUploadFile}
      />
    </div>
  );
}
