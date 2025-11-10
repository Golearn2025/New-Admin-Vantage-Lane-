/**
 * Vehicle Card Component
 * 
 * Displays single vehicle with its documents
 * 100% UI-core components
 */

'use client';

import React, { useState } from 'react';
import { Card, Badge, Button } from '@vantage-lane/ui-core';
import { Car, ChevronDown, ChevronUp } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import type { DocumentType, DocumentStatus } from '@entities/document';
import styles from './VehicleCard.module.css';

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  category: string;
  isActive: boolean;
  documents: Record<string, {
    id: string;
    status: string;
    fileUrl: string;
    expiryDate?: string;
    uploadDate?: string;
    rejectionReason?: string;
  } | undefined>;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onUploadDocument: (vehicleId: string, documentType: DocumentType) => void;
}

const VEHICLE_DOCUMENTS: DocumentType[] = [
  'phv_licence',
  'mot_certificate',
  'insurance_certificate',
  'v5c_logbook',
  'hire_agreement',
];

export function VehicleCard({ vehicle, onUploadDocument }: VehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const cardClassName = styles.card || '';

  return (
    <Card className={cardClassName}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.top}>
            <Car size={20} className={styles.icon} />
            <h3 className={styles.plate}>{vehicle.licensePlate}</h3>
            <Badge color={vehicle.isActive ? 'success' : 'neutral'}>
              {vehicle.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className={styles.details}>
            {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.color}
          </p>
          <p className={styles.category}>{vehicle.category}</p>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className={styles.toggleButton}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>

      {isExpanded && (
        <div className={styles.documents}>
          <div className={styles.documentsHeader}>
            <h4 className={styles.documentsTitle}>Vehicle Documents</h4>
          </div>
          <div className={styles.documentsGrid}>
            {VEHICLE_DOCUMENTS.map((docType) => {
              const doc = vehicle.documents[docType];
              const documentCardDoc = doc ? {
                id: doc.id,
                fileUrl: doc.fileUrl,
                status: doc.status as DocumentStatus,
                ...(doc.expiryDate && { expiryDate: doc.expiryDate }),
                ...(doc.uploadDate && { uploadDate: doc.uploadDate }),
                ...(doc.rejectionReason && { rejectionReason: doc.rejectionReason }),
              } : undefined;
              
              return (
                <DocumentCard
                  key={docType}
                  documentType={docType}
                  document={documentCardDoc}
                  onUpload={() => onUploadDocument(vehicle.id, docType)}
                />
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
