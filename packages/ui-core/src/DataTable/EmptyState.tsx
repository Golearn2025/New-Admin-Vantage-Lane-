/**
 * EmptyState Component
 *
 * Display when table has no data.
 * <50 linii - respectă regulile proiectului!
 */

import React, { ReactNode } from 'react';
import styles from './DataTable.module.css';

interface EmptyStateProps {
  /**
   * Number of columns (for colspan)
   */
  colSpan: number;

  /**
   * Custom empty state content
   */
  children?: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ colSpan, children, className }) => {
  const classes = [styles.emptyState, className].filter(Boolean).join(' ');

  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className={classes}>
          {children || (
            <div className={styles.emptyStateContent}>
              <p>No data available</p>
            </div>
          )}
        </td>
      </tr>
    </tbody>
  );
};

EmptyState.displayName = 'EmptyState';
