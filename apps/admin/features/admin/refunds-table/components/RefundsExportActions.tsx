/**
 * RefundsExportActions Component
 * 
 * Export buttons for exporting all refunds - focused on export functionality
 */

'use client';

import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import styles from './RefundsTable.module.css';

interface RefundsExportActionsProps {
  totalCount: number;
  onExportExcel: () => void;
  onExportCsv: () => void;
}

export function RefundsExportActions({ 
  totalCount, 
  onExportExcel, 
  onExportCsv 
}: RefundsExportActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.exportButton}
        onClick={onExportExcel}
        title="Export all refunds to Excel"
      >
        <FileSpreadsheet size={16} />
        Export Excel
      </button>
      <button
        className={styles.exportButton}
        onClick={onExportCsv}
        title="Export all refunds to CSV"
      >
        <FileText size={16} />
        Export CSV
      </button>
    </div>
  );
}
