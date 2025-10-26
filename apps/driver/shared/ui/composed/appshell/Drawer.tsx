/**
 * Drawer Component - Driver Portal
 */

import React from 'react';
import { DrawerProps } from './types';
import styles from './Drawer.module.css';

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.drawer}>
      <div className={styles.drawerContent}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
