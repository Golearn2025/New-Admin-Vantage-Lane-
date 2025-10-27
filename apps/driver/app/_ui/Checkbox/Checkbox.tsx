/**
 * Checkbox Component - FROZEN
 * 
 * Checkbox component cu label asociat și stări complete.
 * Folosește doar design tokens pentru styling.
 */

import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, disabled = false, className = '', ...props }, ref) {
    const hasError = Boolean(error);
    
    return (
      <div className={`${styles['container']} ${className}`}>
        <div className={styles['checkboxWrapper']}>
          <input
            {...props}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={`${styles['checkbox']} ${hasError ? styles['error'] : ''}`}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : undefined}
          />
          {label && (
            <label 
              htmlFor={props.id}
              className={`${styles['label']} ${disabled ? styles['disabled'] : ''}`}
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <div 
            id={`${props.id}-error`}
            className={styles['errorText']}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);
