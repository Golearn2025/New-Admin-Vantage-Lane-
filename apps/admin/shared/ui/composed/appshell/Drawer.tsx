/**
 * Drawer Component - Mobile Navigation Drawer
 *
 * Slide-in drawer pentru mobile cu focus trap și ESC handling.
 * A11y compliant cu proper ARIA attributes.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { Icon } from '@vantage-lane/ui-icons';
import { DrawerProps } from './types';
import styles from './Drawer.module.css';

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap și ESC handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus pe close button când se deschide
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // ESC key handler
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    // Prevent body scroll când drawer e deschis
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={drawerRef}
      className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Close button */}
      <div className={styles.drawerHeader}>
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close navigation menu"
          type="button"
        >
          <Icon name="chevronDown" size={24} className={styles.closeIcon} />
        </button>
      </div>

      {/* Drawer content */}
      <div className={styles.drawerContent}>{children}</div>
    </div>
  );
}
