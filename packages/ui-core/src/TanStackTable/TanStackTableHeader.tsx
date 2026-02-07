/**
 * TanStack Table Header
 *
 * Renders thead with sort indicators and column resize handles.
 * <80 lines — RULES.md compliant
 */

'use client';

import { flexRender, type HeaderGroup } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import styles from './TanStackTable.module.css';

interface TanStackTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
  stickyHeader?: boolean;
}

export function TanStackTableHeader<TData>({
  headerGroups,
  stickyHeader = false,
}: TanStackTableHeaderProps<TData>): React.ReactElement {
  return (
    <thead className={`${styles.thead} ${stickyHeader ? styles.stickyThead : ''}`}>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} className={styles.headerRow}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={styles.th}
              style={{
                width: header.getSize(),
                position: 'relative',
              }}
            >
              {header.isPlaceholder ? null : (
                <div
                  className={`${styles.headerContent} ${
                    header.column.getCanSort() ? styles.sortable : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && (
                    <span className={styles.sortIcon}>
                      {{
                        asc: <ChevronUp size={14} />,
                        desc: <ChevronDown size={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  )}
                </div>
              )}
              {header.column.getCanResize() && (
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`${styles.resizer} ${
                    header.column.getIsResizing() ? styles.isResizing : ''
                  }`}
                />
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
