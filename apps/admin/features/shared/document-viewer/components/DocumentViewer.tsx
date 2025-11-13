/**
 * DocumentViewer Component
 * 
 * Modal viewer for documents (PDFs and images)
 * With zoom, download, and verification actions
 */

'use client';

import React, { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Modal, Button } from '@vantage-lane/ui-core';
import type { DocumentViewerProps } from '../types';
import styles from './DocumentViewer.module.css';

export function DocumentViewer({
  document,
  onClose,
  onVerify,
  onReject,
  onDownload,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    } else {
      window.open(document.url, '_blank');
    }
  };

  const isPdf = document.type === 'pdf';

  return (
    <Modal isOpen={true} onClose={onClose} title={document.name} size="xl">
      <div className={styles.container}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.zoomControls}>
            <button
              className={styles.toolButton}
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              aria-label="Zoom out"
            >
              <Minus size={20} strokeWidth={2} />
            </button>
            <span className={styles.zoomLevel}>{zoom}%</span>
            <button
              className={styles.toolButton}
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              aria-label="Zoom in"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
            <button className={styles.toolButton} onClick={handleZoomReset} aria-label="Reset zoom">
              <RotateCcw size={20} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={handleDownload}>
              Download
            </Button>
            {onVerify && !document.verified && (
              <Button variant="primary" onClick={() => onVerify(document.id)}>
                ✓ Verify
              </Button>
            )}
            {onReject && !document.verified && (
              <Button variant="danger" onClick={() => onReject(document.id)}>
                ✗ Reject
              </Button>
            )}
          </div>
        </div>

        {/* Document Display */}
        <div className={styles.viewer}>
          {isPdf ? (
            <iframe
              src={document.url}
              className={styles.pdfFrame}
              title={document.name}
              style={{ transform: `scale(${zoom / 100})` }}
            />
          ) : (
            <div className={styles.imageContainer}>
              <img
                src={document.url}
                alt={document.name}
                className={styles.image}
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
          )}
        </div>

        {/* Document Info */}
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Type:</span>
            <span className={styles.infoValue}>{document.type.toUpperCase()}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Uploaded:</span>
            <span className={styles.infoValue}>
              {new Date(document.uploadedAt).toLocaleString()}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Status:</span>
            <span className={document.verified ? styles.verified : styles.pending}>
              {document.verified ? '✓ Verified' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
