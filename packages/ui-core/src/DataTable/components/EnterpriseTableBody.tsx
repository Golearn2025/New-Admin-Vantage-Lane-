/**
 * EnterpriseTableBody Component
 * 
 * Table body wrapper for EnterpriseDataTable with:
 * - Zero inline functions
 * - Zero logic (pure rendering)
 * - key={rowId} NOT index
 * - Delegates to EnterpriseTableRow
 * 
 * Ver 2.5 - PAS 4: EnterpriseDataTable Performance Optimization
 */

import React from 'react';
import { EnterpriseTableRow } from './EnterpriseTableRow';
import styles from '../DataTable.module.css';
import type { Column } from '../types/index';
import type { UseSelectionReturn } from '../hooks';

interface EnterpriseTableBodyProps<T> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Selection hook */
  selection?: UseSelectionReturn<T> | undefined;
  /** Row click handler (pre-memoized in parent) */
  onRowClick?: ((row: T) => void) | undefined;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * EnterpriseTableBody - Pure rendering component
 * Maps data to EnterpriseTableRow components
 */
export function EnterpriseTableBody<T>({
  data,
  columns,
  selection,
  onRowClick,
  className,
}: EnterpriseTableBodyProps<T>): React.ReactElement {
  const classes = [styles.body, className].filter(Boolean).join(' ');

  return (
    <tbody className={classes}>
      {data.map((row, index) => {
        // Extract row ID - prefer row.id over index
        const rowData = row as Record<string, unknown>;
        const rowId = String(rowData.id ?? index);
        
        // Check selection state
        const isSelected = selection?.isRowSelected(rowId) ?? false;

        return (
          <EnterpriseTableRow
            key={rowId}
            row={row}
            rowId={rowId}
            columns={columns}
            isSelected={isSelected}
            onRowClick={onRowClick}
            selection={selection}
          />
        );
      })}
    </tbody>
  );
}

EnterpriseTableBody.displayName = 'EnterpriseTableBody';
