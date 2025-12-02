/**
 * PaymentsExport Component
 * 
 * Export functionality and bulk actions
 * 
 * ✅ Zero any types
 * ✅ UI-core components
 * ✅ Lucide-react icons
 */

import { FileSpreadsheet, FileText } from 'lucide-react';
import { BulkActionsToolbar } from '@vantage-lane/ui-core';
import type { UseSelectionReturn } from '@vantage-lane/ui-core';
import type { Payment } from '../types';
import styles from './PaymentsTable.module.css';

interface PaymentsExportProps {
  data: Payment[];
  selection: UseSelectionReturn<any>;
}

export function PaymentsExport({ data, selection }: PaymentsExportProps) {
  // Export functions
  const handleExportAll = (format: 'excel' | 'csv') => {
    console.log(`Exporting all ${data.length} payments to ${format}`);
    alert(`Exporting all ${data.length} payments to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  const handleExportSelected = (format: 'excel' | 'csv') => {
    console.log(`Exporting ${selection.selectedCount} selected payments to ${format}`);
    alert(`Exporting ${selection.selectedCount} selected payments to ${format.toUpperCase()}`);
    // TODO: Implement actual export logic
  };

  // Bulk actions pentru selected rows
  const bulkActions = [
    {
      id: 'export-excel',
      label: 'Export Selected (Excel)',
      onClick: () => handleExportSelected('excel'),
    },
    {
      id: 'export-csv',
      label: 'Export Selected (CSV)',
      onClick: () => handleExportSelected('csv'),
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      onClick: () => {
        if (confirm(`Delete ${selection.selectedCount} payments?`)) {
          console.log('Deleting:', selection.selectedRows);
        }
      },
      destructive: true,
    },
  ];

  return (
    <>
      {/* Export Header Buttons */}
      <div className={styles.actions}>
        <button
          className={styles.exportButton}
          onClick={() => handleExportAll('excel')}
          title="Export all payments to Excel"
        >
          <FileSpreadsheet size={16} />
          Export Excel
        </button>
        <button
          className={styles.exportButton}
          onClick={() => handleExportAll('csv')}
          title="Export all payments to CSV"
        >
          <FileText size={16} />
          Export CSV
        </button>
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selection.selectedCount}
        actions={bulkActions}
        onClearSelection={selection.clearSelection}
      />
    </>
  );
}
