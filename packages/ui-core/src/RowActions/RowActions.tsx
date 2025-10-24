/**
 * RowActions Component
 * 
 * Dropdown menu pentru acțiuni pe rând (View/Edit/Delete)
 * Premium UI cu hover effects și icons
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (action: RowAction) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`${styles.container} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Row actions"
        aria-expanded={isOpen}
      >
        <Icon name="more-vertical" size="sm" />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.action} ${
                action.variant === 'danger' ? styles.actionDanger : ''
              } ${action.disabled ? styles.actionDisabled : ''}`}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
            >
              {action.icon && <Icon name={action.icon} size="sm" />}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
