/**
 * FormField Component - UNIVERSAL REUTILIZABIL
 * 
 * Component pentru input fields cu design premium gold.
 * Poate fi folosit în orice formular (admin, operator, driver, customer).
 * Limită: ≤150 linii
 */

'use client';

import React from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  icon?: string;
  hint?: string;
  error?: string;
  rows?: number;
}

export function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  icon,
  hint,
  error,
  rows = 4,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange && !disabled && !readOnly) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {icon && <span className={styles.labelIcon}>{icon}</span>}
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          className={`${styles.textarea} ${error ? styles.hasError : ''}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          className={`${styles.input} ${error ? styles.hasError : ''}`}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
      )}

      {error && <span className={styles.errorText}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
