/**
 * ErrorBanner Component - Server Errors și Validation Errors
 * 
 * Banner pentru afișarea erorilor cu tipuri diferite și acțiuni opționale.
 * Folosește DOAR design tokens și asigură A11y compliance.
 */

import { ReactNode } from 'react';
import { Button } from '@admin/shared/ui/core/Button';
import styles from './ErrorBanner.module.css';

export interface ErrorBannerProps {
  type?: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
}

export function ErrorBanner({
  type = 'error',
  message,
  details,
  actionLabel,
  onAction,
  onClose,
  className = ''
}: ErrorBannerProps) {
  const bannerClass = `${styles['banner']} ${styles[`banner--${type}`]} ${className}`;
  
  return (
    <div 
      className={bannerClass}
      role="alert"
      aria-live="polite"
    >
      <div className={styles['content']}>
        <div className={styles['message']}>
          {message}
        </div>
        
        {details && (
          <div className={styles['details']}>
            {details}
          </div>
        )}
      </div>
      
      {(actionLabel || onClose) && (
        <div className={styles['actions']}>
          {actionLabel && onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
          
          {onClose && (
            <button
              className={styles['closeButton']}
              onClick={onClose}
              aria-label="Close error banner"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
