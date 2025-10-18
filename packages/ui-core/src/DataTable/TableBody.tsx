/**
 * TableBody Component
 * 
 * Table body with rows, expandable content, and empty/loading states.
 * Generic component - works with any data type.
 * <100 linii - respectă regulile proiectului!
 */

import React, { ReactNode } from 'react';
import styles from './DataTable.module.css';
import { TableRow } from './TableRow';
import { Column } from './types';

interface TableBodyProps<TData = unknown> {
  data: TData[];
  columns: Column<TData>[];
  getRowId: (row: TData, index: number) => string;
  selectedIds?: Set<string>;
  expandedIds?: Set<string>;
  renderExpandedRow?: (row: TData) => ReactNode;
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowHover?: (row: TData | null) => void;
  hoverable?: boolean;
  className?: string;
}

export function TableBody<TData = unknown>({
  data,
  columns,
  getRowId,
  selectedIds = new Set(),
  expandedIds = new Set(),
  renderExpandedRow,
  onRowClick,
  onRowHover,
  hoverable = false,
  className,
}: TableBodyProps<TData>): JSX.Element {
  const classes = [
    styles.body,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <tbody className={classes}>
      {data.map((row, index) => {
        const rowId = getRowId(row, index);
        const isSelected = selectedIds.has(rowId);
        const isExpanded = expandedIds.has(rowId);
        
        return (
          <React.Fragment key={rowId}>
            {/* Main row */}
            <TableRow
              row={row}
              rowId={rowId}
              columns={columns}
              isSelected={isSelected}
              isExpanded={isExpanded}
              hoverable={hoverable}
              {...(onRowClick && { onClick: onRowClick })}
              {...(onRowHover && { onHover: onRowHover })}
            />
            
            {/* Expanded row content */}
            {isExpanded && renderExpandedRow && (
              <tr className={styles.expandedRow}>
                <td colSpan={columns.length} className={styles.expandedCell}>
                  {renderExpandedRow(row)}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}

TableBody.displayName = 'TableBody';
