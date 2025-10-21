/**
 * ProfileCard Component - PREMIUM REUTILIZABIL
 *
 * Card premium pentru afișare date profil.
 * Poate fi folosit pentru: admin, operator, driver, customer
 * Limită: ≤200 linii
 */

'use client';

import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardField {
  label: string;
  value: string | React.ReactNode;
  icon?: string;
  editable?: boolean;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  onChange?: (value: string) => void;
}

interface ProfileCardProps {
  title: string;
  icon?: string;
  fields: ProfileCardField[];
  variant?: 'default' | 'highlight' | 'muted';
}

export function ProfileCard({ title, icon, fields, variant = 'default' }: ProfileCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.header}>
        {icon && <span className={styles.headerIcon}>{icon}</span>}
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.fields}>
        {fields.map((field, index) => (
          <div key={index} className={styles.fieldRow}>
            <div className={styles.fieldLabel}>
              {field.icon && <span className={styles.fieldIcon}>{field.icon}</span>}
              <span>{field.label}</span>
            </div>

            <div className={styles.fieldValue}>
              {field.editable ? (
                field.type === 'textarea' ? (
                  <textarea
                    className={styles.textarea}
                    value={typeof field.value === 'string' ? field.value : ''}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <input
                    className={styles.input}
                    type={field.type || 'text'}
                    value={typeof field.value === 'string' ? field.value : ''}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    placeholder={field.placeholder}
                  />
                )
              ) : (
                <span className={styles.valueText}>{field.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
