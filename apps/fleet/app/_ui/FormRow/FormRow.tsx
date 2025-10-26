/**
 * FormRow Component - Consistent Input with Label and Error State
 *
 * Wrapper pentru Input cu label asociat și error state management.
 * Asigură consistency în forme și A11y compliance.
 */

import React from 'react';
import { Input, type InputProps } from '../Input';
import styles from './FormRow.module.css';

export interface FormRowProps extends Omit<InputProps, 'id'> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormRow({ id, label, error, hint, required = false, ...inputProps }: FormRowProps) {
  const hasError = Boolean(error);

  return (
    <div className={styles['container']}>
      <label htmlFor={id} className={styles['label']}>
        {label}
        {required && (
          <span className={styles['required']} aria-label="required">
            *
          </span>
        )}
      </label>

      <Input
        {...inputProps}
        id={id}
        {...(error && { error })}
        aria-invalid={hasError}
        {...(error
          ? { 'aria-describedby': `${id}-error` }
          : hint
            ? { 'aria-describedby': `${id}-hint` }
            : {})}
      />

      {hint && !error && (
        <div id={`${id}-hint`} className={styles['hint']}>
          {hint}
        </div>
      )}

      {error && (
        <div id={`${id}-error`} className={styles['error']} role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}
