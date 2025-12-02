/**
 * DisputesExportActions Component
 * 
 * Export buttons for exporting all disputes - focused on export functionality
 */

'use client';

import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import styles from './DisputesTable.module.css';

interface DisputesExportActionsProps {
  totalCount: number;
  onExportExcel: () => void;
  onExportCsv: () => void;
}

export function DisputesExportActions({ 
  totalCount, 
  onExportExcel, 
  onExportCsv 
}: DisputesExportActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.exportButton}
        onClick={onExportExcel}
        title="Export all disputes to Excel"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>
      <button
        className={styles.exportButton}
        onClick={onExportCsv}
        title="Export all disputes to CSV"
      >
        <FileText size={16} />
        Export CSV
      </button>
    </div>
  );
}
