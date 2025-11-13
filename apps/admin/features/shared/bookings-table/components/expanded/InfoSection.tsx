/**
 * InfoSection Component - Reusable Information Card
 * 
 * Generic card component for displaying sectioned information.
 * Can be used throughout the app for consistent UI.
 * 
 * Features:
 * - Multiple variants (default, compact, highlight, bordered)
 * - Optional icon
 * - Optional actions (buttons/links in header)
 * - Collapsible option
 * 
 * Compliant: <100 lines, TypeScript strict, 100% reusable
 */

'use client';

import React, { useState } from 'react';
import styles from './InfoSection.module.css';

export interface InfoSectionProps {
  /** Section title */
  title: string;

  /** Optional icon (emoji or component) */
  icon?: string | React.ReactNode;

  /** Section content */
  children: React.ReactNode;

  /** Visual variant */
  variant?: 'default' | 'compact' | 'highlight' | 'bordered';

  /** Optional actions in header (buttons, links) */
  actions?: React.ReactNode;

  /** Make section collapsible */
  collapsible?: boolean;

  /** Default collapsed state (if collapsible) */
  defaultCollapsed?: boolean;

  /** Additional CSS class */
  className?: string;
}

export function InfoSection({
  title,
  icon,
  children,
  variant = 'default',
  actions,
  collapsible = false,
  defaultCollapsed = false,
  className,
}: InfoSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const containerClasses = [
    styles.container,
    styles[`variant-${variant}`],
    collapsible && styles.collapsible,
    isCollapsed && styles.collapsed,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={styles.header} onClick={handleToggle}>
        <div className={styles.headerLeft}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h4 className={styles.title}>{title}</h4>
          {collapsible && (
            <span className={styles.collapseIcon}>{isCollapsed ? '▶' : '▼'}</span>
          )}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {/* Content */}
      {!isCollapsed && <div className={styles.content}>{children}</div>}
    </div>
  );
}
