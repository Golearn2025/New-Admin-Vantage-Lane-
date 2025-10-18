/**
 * ProfileSection Component - REUTILIZABIL
 * 
 * Secțiune pentru grupare fields în profile forms.
 * Limită: ≤100 linii
 */

'use client';

import React from 'react';
import styles from './ProfileSection.module.css';

export interface ProfileSectionProps {
  title: string;
  icon?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export function ProfileSection({
  title,
  icon,
  description,
  children,
  variant = 'default',
}: ProfileSectionProps) {
  return (
    <div className={`${styles.section} ${styles[variant]}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div>
            <h3 className={styles.title}>{title}</h3>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
