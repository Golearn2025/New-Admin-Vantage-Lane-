/**
 * TanStack Table Body
 *
 * Renders tbody with rows, expanded rows, and row classNames.
 * <100 lines — RULES.md compliant
 */

'use client';

import { flexRender, type Row } from '@tanstack/react-table';
import React from 'react';
import styles from './TanStackTable.module.css';

interface TanStackTableBodyProps<TData> {
  rows: Row<TData>[];
  /** Set of expanded row IDs */
  expandedIds: Set<string>;
  /** Render function for expanded row content */
  renderExpandedRow?: ((row: TData) => React.ReactNode) | undefined;
  /** Get unique row ID */
  getRowId: (row: TData) => string;
  /** Get custom className for a row */
  getRowClassName?: ((row: TData) => string) | undefined;
  /** Total visible column count (for colSpan on expanded/empty rows) */
  colSpan: number;
  /** Striped rows */
  striped?: boolean | undefined;
  /** Optional: callback when a row is clicked */
  onRowClick?: ((row: TData) => void) | undefined;
}

export function TanStackTableBody<TData>({
  rows,
  expandedIds,
  renderExpandedRow,
  getRowId,
  getRowClassName,
  colSpan,
  striped = false,
  onRowClick,
}: TanStackTableBodyProps<TData>): React.ReactElement {
  return (
    <tbody className={styles.tbody}>
      {rows.map((row, index) => {
        const original = row.original;
        const rowId = getRowId(original);
        const isExpanded = expandedIds?.has(rowId) ?? false;
        const customClass = getRowClassName?.(original) ?? '';
        const stripeClass = striped && index % 2 === 1 ? styles.stripedRow : '';

        return (
          <React.Fragment key={row.id}>
            <tr
              className={`${styles.tr} ${customClass} ${stripeClass} ${
                row.getIsSelected() ? styles.selectedRow : ''
              }`}
              onClick={onRowClick ? () => onRowClick(original) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={styles.td}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {isExpanded && renderExpandedRow && (
              <tr className={styles.expandedRow}>
                <td colSpan={colSpan} className={styles.expandedCell}>
                  {renderExpandedRow(original)}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}
