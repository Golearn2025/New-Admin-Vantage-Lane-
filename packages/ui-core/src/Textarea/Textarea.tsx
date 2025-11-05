/**
 * Textarea Component
 * 
 * Multi-line text input component fără label (label se gestionează în FormRow).
 * Folosește doar design tokens pentru styling.
 * MODERN & PREMIUM - 100% Design Tokens
 */

import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  label,
  error,
  hint,
  disabled = false,
  size = 'md',
  resize = 'vertical',
  showCharCount = false,
  maxLength,
  className = '',
  id,
  value,
  ...props
}, ref) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  
  const characterCount = value ? String(value).length : 0;
  
  const wrapperClasses = [
    styles.wrapper,
    size && styles[size],
    error && styles.hasError,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');
  
  const textareaClasses = [
    styles.textarea,
    styles[`resize-${resize}`]
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.textareaWrapper}>
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          value={value}
          {...props}
        />
      </div>
      
      <div className={styles.footer}>
        <div className={styles.messages}>
          {error && (
            <span id={errorId} className={styles.error} role="alert">
              {error}
            </span>
          )}
          
          {hint && !error && (
            <span id={hintId} className={styles.hint}>
              {hint}
            </span>
          )}
        </div>
        
        {showCharCount && maxLength && (
          <span className={styles.charCount}>
            {characterCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
});
