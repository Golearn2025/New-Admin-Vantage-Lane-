/**
 * RowActions Component
 * 
 * Dropdown menu pentru acțiuni pe rând (View/Edit/Delete)
 * Premium UI cu hover effects și icons
 */

'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import styles from './RowActions.module.css';

export interface RowAction {
  label: string;
  icon?: 'eye' | 'edit' | 'trash' | 'download';
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface RowActionsProps {
  actions: RowAction[];
  disabled?: boolean;
  className?: string;
}

export function RowActions({ actions, disabled = false, className = '' }: RowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mount flag for portals (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute dropdown position relative to viewport to avoid clipping
  const computePosition = useCallback(() => {
    const btn = triggerRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const margin = 4; // spacing token proxy
    const dropdownWidth = 200; // min width estimate; CSS can expand
    const dropdownHeight = 160; // estimate; will be adjusted by viewport checks

    let top = rect.bottom + margin;
    let left = rect.right - dropdownWidth; // align right edges

    // Keep inside viewport horizontally
    const vw = window.innerWidth;
    if (left + dropdownWidth > vw - margin) left = vw - dropdownWidth - margin;
    if (left < margin) left = margin;

    // Keep inside viewport vertically (flip above if near bottom)
    const vh = window.innerHeight;
    if (top + dropdownHeight > vh - margin) {
      top = Math.max(margin, rect.top - dropdownHeight - margin);
    }

    setMenuPos({ top, left });
  }, []);

  // Recompute on open, resize, scroll
  useLayoutEffect(() => {
    if (!isOpen) return;
    computePosition();
    window.addEventListener('scroll', computePosition, true);
    window.addEventListener('resize', computePosition);
    return () => {
      window.removeEventListener('scroll', computePosition, true);
      window.removeEventListener('resize', computePosition);
    };
  }, [isOpen, computePosition]);

  // Close on outside click (document-level)
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return; // allow toggling by trigger
      if (dropdownRef.current?.contains(t)) return; // clicks inside menu
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleActionClick = (action: RowAction) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className={`${styles.container} ${className}`}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen((v) => !v)}
          disabled={disabled}
          aria-label="Row actions"
          aria-expanded={isOpen}
          ref={triggerRef}
        >
          <Icon name="more-vertical" size="sm" />
        </button>

        {mounted && isOpen && createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdown}
            style={{
              position: 'fixed',
              top: `${menuPos.top}px`,
              left: `${menuPos.left}px`,
              zIndex: 9999,
            }}
            role="menu"
          >
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.action} ${
                  action.variant === 'danger' ? styles.actionDanger : ''
                } ${action.disabled ? styles.actionDisabled : ''}`}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                role="menuitem"
              >
                {action.icon && <Icon name={action.icon} size="sm" />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </>
  );
}
