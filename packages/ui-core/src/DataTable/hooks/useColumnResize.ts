'use client';

/**
 * useColumnResize Hook
 * Modular column resizing with mouse
 * Enterprise pattern - 100% reusable
 */

import { useState, useCallback, useRef } from 'react';

export interface ColumnWidth {
  [columnKey: string]: number;
}

export interface UseColumnResizeOptions {
  /** Initial column widths */
  initialWidths?: ColumnWidth;
  /** Minimum column width */
  minWidth?: number;
  /** Maximum column width */
  maxWidth?: number;
}

export interface UseColumnResizeReturn {
  /** Current column widths */
  columnWidths: ColumnWidth;
  /** Start resizing a column */
  startResize: (e: React.MouseEvent, columnKey: string, currentWidth: number) => void;
  /** Set column width */
  setColumnWidth: (columnKey: string, width: number) => void;
  /** Reset column width */
  resetColumnWidth: (columnKey: string) => void;
  /** Reset all column widths */
  resetAllWidths: () => void;
  /** Check if column is being resized */
  isResizing: boolean;
}

export function useColumnResize(
  options: UseColumnResizeOptions = {}
): UseColumnResizeReturn {
  const {
    initialWidths = {},
    minWidth = 80,
    maxWidth = 800,
  } = options;

  const [columnWidths, setColumnWidths] = useState<ColumnWidth>(initialWidths);
  const [isResizing, setIsResizing] = useState(false);
  
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const startResize = useCallback((
    e: React.MouseEvent,
    columnKey: string,
    currentWidth: number
  ) => {
    e.preventDefault();
    setIsResizing(true);
    resizingColumn.current = columnKey;
    startX.current = e.clientX;
    startWidth.current = currentWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColumn.current) return;
      
      const diff = moveEvent.clientX - startX.current;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidth.current + diff)
      );
      
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn.current!]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizingColumn.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [minWidth, maxWidth]);

  const setColumnWidth = useCallback((columnKey: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: Math.max(minWidth, Math.min(maxWidth, width)),
    }));
  }, [minWidth, maxWidth]);

  const resetColumnWidth = useCallback((columnKey: string) => {
    setColumnWidths((prev) => {
      const updated = { ...prev };
      delete updated[columnKey];
      return updated;
    });
  }, []);

  const resetAllWidths = useCallback(() => {
    setColumnWidths({});
  }, []);

  return {
    columnWidths,
    startResize,
    setColumnWidth,
    resetColumnWidth,
    resetAllWidths,
    isResizing,
  };
}
