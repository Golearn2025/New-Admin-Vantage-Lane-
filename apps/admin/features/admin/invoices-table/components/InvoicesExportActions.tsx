/**
 * InvoicesExportActions Component
 * 
 * Export buttons for exporting all invoices - focused on export functionality
 */

'use client';

import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import styles from './InvoicesTable.module.css';

interface InvoicesExportActionsProps {
  totalCount: number;
  onExportExcel: () => void;
  onExportCsv: () => void;
}

export function InvoicesExportActions({ 
  totalCount, 
  onExportExcel, 
  onExportCsv 
}: InvoicesExportActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.exportButton}
        onClick={onExportExcel}
        title="Export all invoices to Excel"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>
      <button
        className={styles.exportButton}
        onClick={onExportCsv}
        title="Export all invoices to CSV"
      >
        <FileText size={16} />
        Export CSV
      </button>
    </div>
  );
}
