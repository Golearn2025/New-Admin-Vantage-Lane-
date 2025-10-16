/**
 * Input Component - FROZEN v2
 * 
 * Input component fără label (label se gestionează în FormRow).
 * Folosește doar design tokens pentru styling.
 */

import { ReactNode, InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  hint?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  error,
  hint,
  disabled = false,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  const wrapperClasses = [
    styles.wrapper,
    size && styles[size],
    error && styles.hasError,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    styles.input,
    leftIcon && styles.hasLeftIcon,
    rightIcon && styles.hasRightIcon
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        
        {rightIcon && (
          <span className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      
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
  );
});
