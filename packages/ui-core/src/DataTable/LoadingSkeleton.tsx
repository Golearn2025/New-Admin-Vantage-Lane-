/**
 * LoadingSkeleton Component
 * 
 * Display skeleton rows while table is loading.
 * <80 linii - respectă regulile proiectului!
 */

import React from 'react';
import styles from './DataTable.module.css';

interface LoadingSkeletonProps {
  /**
   * Number of columns
   */
  columns: number;
  
  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;
  
  /**
   * Additional CSS class
   */
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  columns,
  rows = 5,
  className,
}) => {
  const classes = [
    styles.skeleton,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <tbody className={classes}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className={styles.skeletonRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className={styles.skeletonCell}>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLine} />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';
